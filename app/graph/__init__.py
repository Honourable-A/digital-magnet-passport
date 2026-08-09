# neo4j deferred — not in scope for current Supabase stager
# re-enable when blockchain/graph layer is introduced

# from neo4j import GraphDatabase
# from app.config import settings

# driver = GraphDatabase.driver(
#     settings.neo4j_uri,
#     auth=(settings.neo4j_user, settings.neo4j_password)
# )

# def get_graph():
#     session = driver.session()
#     try:
#         yield session
#     finally:
#         session.close()
