#!/usr/local/bin/konoha

OUT << "Content-Type: text/plain" << EOL << EOL;

//Bytes b = new byte[$env.CONTENT_LENGTH];
//IN.read(b, 0, |b|);
//print b.decode();

using konoha.sql.*;

//----- Define User Class -----
class User {
	String name;
	String password;
	String git_path;//src file saved dir
	UserList friendList;
	// ForkList
	// ForkedList
	User() {
		friendList = new UserList();
	}
	//----- Add Friends -----
	//script by using konoha.sql
	void addFriend(User friend) {
		friendList.addFriend(friend);
	}
}

//----- Define User List Managing UData -----
class UserList {
	User[] list;

	UserList(){
		list = [];
	}
	
	User getUserFromName(String name) {
		int i = 0;
		which (list[i] != null) {
			if(list[i].name == name) {
				return list.[i];
			}
			i ++;
		}
		return null;
	}
	
	//----- Register User Account -----
	//1.script by using konoha.sql
	
	boolean checkUserName(String name) { // check user name existence. true = existence
		int i = 0;
		which (list[i] != null) {
			if (list[i].name == name) {
				return true;
			}
			i ++;
		}
		return false;
	}
	
	boolean checkPassword(String password) {
		int i = 0;
		which (list[i] != null) {
			if (list[i].password == password) {
				return true;
			}
			i ++;
		}
		return false;
	}
	
	void addUser(String name, String password) {
		if (checkUserName(name) == false) {
			//add user
		}
		else {
			//can't add user
		}
	}

	//2.make the user's repo on git by git cmd
	void makeUserGitRepo() {
		/*
		make git repository
		to /repo_for_management/usrname/
		*/
	}

	//----- Login User -----
	//script by using konoha.sql
	boolean checkLogin(String name, String password) {
		if (checkUserName(name) == true && checkPassword(password) == true) {
			return true;
		}
		else {
			return false;
		}
	}

	//----- Find Friends -----
	//script by using konoha.sql
	UserList findFriendList(String name) {
		return friendList;
	}

}
