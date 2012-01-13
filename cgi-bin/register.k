#!/usr/local/bin/konoha

using konoha.sql.*;

OUT << "Content-Type: text/plain" << EOL << EOL;

boolean doubly = false; //true = doubling
Connection con = new Connection("./users/users.sqlite3");
ResultSet rSet = con.query("select * from user");

String qStr = $env.QUERY_STRING;
String[] map = qStr.split("&");
String uName = map[1].replace("username=", "");
String password = map[2].replace("password1=", "");
OUT << uName << EOL;
OUT << password << EOL;

while (rSet.next()) {
	if (uName == rSet.getString("NAME") && password == rSet.getString("PASSWORD")) {
		doubly = true;
		break;
	}
}

if (doubly == true) {
	print "Register failed";
}
else {
	String dbq = "insert into user values('";
	dbq += uName + "' , '" + password + "');";
	print dbq;
	con.exec(dbq);
	print "Register completed";
}

rSet.close();
con.close();
