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
    preferences = Column(JSONB)

    def to_dict(self):
        modified_profile = copy.deepcopy(self.profile)
        modified_profile["main_keywords"] = json.loads(modified_profile.get("main_keywords", "[]"))
        modified_profile["trl_level"] = json.loads(modified_profile.get("trl_level", "[]"))
        modified_profile["expert_profile"] = json.loads(modified_profile.get("expert_profile", "[]"))
        modified_profile["areas_of_expertise"] = list(map(
            lambda it_area_code: utils.expertise_thematic_options[it_area_code],
            json.loads(modified_profile.get("areas_of_expertise", "[]"))
        ))
        modified_profile["coordinated_projects_and_calls"] = json.loads(modified_profile.get("coordinated_projects_and_calls", "[]"))
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
        modified_preferences = {
            it_pref_key: self.preferences[it_pref_key] for it_pref_key in filter(
                lambda it_key: "visibility" in it_key, self.preferences)
        }
        return {
            "id": self.id,
            "username": self.username,
            "profile": modified_profile,
            "preferences": modified_preferences
        }


class UserProfileField(SystemField):
    def _get_user_profile(self, record, owner=None):
        r_user_profile = {}
        community_id = ModelField("id").__get__(record)

        import uuid
        # If it's a person, and we don't have the "person" metadata, we can't get the user profile
        if ( isinstance(community_id, uuid.UUID)
            and record.get("metadata", {}).get("type", {}).get("id", "community") == "person"
            and "person" in record.get("metadata", {})
        ):
            user_id = None
            if "user_id" in record["metadata"]["person"]:
                user_id = record["metadata"]["person"]["user_id"]
            else:
                # get user_id by community_id
                from invenio_communities.members.records.api import Member
                owners = [m.dumps() for m in Member.get_members(record.id) if m.role == "owner"]
                user_id = owners[0]["user_id"] if len(owners) > 0 else None

            if user_id is not None:
                # get user profile by user_id
                user = db.session.query(User).filter_by(id=user_id).first()
                if user is not None:
                    r_user_profile = user.to_dict()
        return r_user_profile

    def __get__(self, record, owner=None):
        return self._get_user_profile(record, owner)

    def pre_dump(self, record, data, dumper=None):
        """Called after a record is dumped."""
        data[self.attr_name] = self._get_user_profile(record, None)

    def post_load(self, record, data, loader=None):
        """Called after a record is loaded."""
        data[self.attr_name] = self._get_user_profile(record, None)
