# user table removed — auth and roles are managed entirely by Supabase Auth
# role is stored in raw_user_meta_data on the Supabase auth.users record
# keeping this file so git history is preserved; class is commented out

# roles: MANUFACTURER, RECYCLER, AUDITOR, REGULATOR, ADMIN
# class User(Base):
#     __tablename__ = "user"
#
#     id = Column(Integer, primary_key=True, autoincrement=True)
#     email = Column(String(200), unique=True, nullable=False)
#     password_hash = Column(String(255), nullable=False)
#     role = Column(String(50), nullable=False, default="MANUFACTURER")
#     supabase_uid = Column(String(36), unique=True, nullable=True)  # links to auth.users.id
#     created_at = Column(DateTime, default=datetime.utcnow)
#     updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
