import mysql.connector

def connect_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        database="projet_dev",
        connection_timeout=5
    )