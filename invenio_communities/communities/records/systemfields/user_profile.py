import copy
import json

from invenio_communities import utils
from invenio_records.systemfields import SystemField
from invenio_db import db
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base
from sqlalchemy.dialects.postgresql import JSONB
from invenio_records.systemfields import ModelField

Base = declarative_base()


class Members(Base):
    __tablename__ = 'communities_members'

    id = Column(Integer, primary_key=True)
    community_id = Column(String)
    user_id = Column(Integer)

    def to_dict(self):
        return {
            "community_id": self.community_id,
            "user_id": self.user_id,
        }


class User(Base):
    __tablename__ = 'accounts_user'

    id = Column(Integer, primary_key=True)
    username = Column(String)
    profile = Column(JSONB)

    def to_dict(self):
        modified_profile = copy.deepcopy(self.profile)
        modified_profile["main_keywords"] = json.loads(modified_profile.get("main_keywords", "[]"))
        modified_profile["trl_level"] = json.loads(modified_profile.get("trl_level", "[]"))
        modified_profile["expert_profile"] = json.loads(modified_profile.get("expert_profile", "[]"))
        modified_profile["areas_of_expertise"] = list(map(
            lambda it_area_code: utils.expertise_thematic_options[it_area_code],
            json.loads(modified_profile.get("areas_of_expertise", "[]"))
        ))
        modified_profile["knowledge_transfer_experience"] = []
        knowledge_transfer_experience = {
            "founder_of_a_spin_off": "Founder of a spin-off",
            "member_of_a_spin_off": "Member of a spin-off",
            "patents": "Patent owner",
            "member_of_an_industrial_chair": "Member of an Industrial Chair"

        }
        for it_experience in knowledge_transfer_experience:
            if modified_profile.get(it_experience, False):
                modified_profile["knowledge_transfer_experience"].append(knowledge_transfer_experience[it_experience])
        return {
            "id": self.id,
            "username": self.username,
            "profile": modified_profile
        }


class UserProfileField(SystemField):
    def _get_user_profile(self, record, owner=None):
        community_id = ModelField("id").__get__(record)

        import uuid
        if not isinstance(community_id, uuid.UUID):
            return {}

        # get user_id by community_id
        from invenio_communities.members.records.api import Member

        owners = [m.dumps() for m in Member.get_members(record.id) if m.role == "owner"]
        user_id = owners[0]["user_id"] if len(owners) > 0 else None
        if user_id is None:
            return {}

        # get user profile by user_id
        user = db.session.query(User).filter_by(id=user_id).first()
        if user is None:
            return {}

        user_profile = user.to_dict()["profile"] if "profile" in user.to_dict() else None
        if user_profile is None:
            return {}

        # if user has not check "Declaration of consent" return nothing
        if "consent_by_providing_my_consent" in user_profile and not user_profile["consent_by_providing_my_consent"]:
            return {}

        # if user check private, return nothing
        if "visibility" in user_profile and user_profile['visibility']:
            return {}

        return user.to_dict()

    def __get__(self, record, owner=None):
        return self._get_user_profile(record, owner)

    def pre_dump(self, record, data, dumper=None):
        """Called after a record is dumped."""
        data[self.attr_name] = self._get_user_profile(record, None)
