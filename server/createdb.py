import mysql.connector

mydb = mysql.connector.connect(host="localhost", user="user", passwd="password123", database="surveydb")

cursor = mydb.cursor()

# Define the SQL query to delete rows with blank languages
delete_query = "DELETE FROM survey_response WHERE colour = ''"

# Execute the query
cursor.execute(delete_query)

# Commit the changes
mydb.commit()

# Check how many rows were deleted
print(cursor.rowcount, "record(s) deleted")

# Close the cursor and connection
cursor.close()
mydb.close()