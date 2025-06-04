from invenio_records.systemfields import SystemField
from invenio_db import db
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base
from sqlalchemy.dialects.postgresql import JSONB
from invenio_records.systemfields import  ModelField

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
        return {
            "id": self.id,
            "username": self.username,
            "profile": self.profile
        }

class UserProfileField(SystemField):
    def _get_user_profile(self, record, owner):
        community_id = ModelField("id").__get__(record)
        
        import uuid
        if not isinstance(community_id, uuid.UUID):
            return {}
        
        # get user_id by community_id
        result = db.session.query(Members.user_id).filter_by(community_id=community_id).first()
        user_id = result[0] if result else None
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
        if "Visibility" in user_profile and user_profile['Visibility']:
            return {}
        
        return user.to_dict()

    def __get__(self, record, owner=None):
        return self._get_user_profile(record,owner)
