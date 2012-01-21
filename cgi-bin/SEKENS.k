#!/usr/local/bin/konoha

using konoha.uuid.*;
using konoha.cookie.*;

OUT << "Content-Type: text/pain" << EOL << EOL;

USER_NAME = "";
USER_SID = "";
USER_GIT_REPO_DIR = "";
CURRENT_DIR = "";
EDIT_FILE_NAME = "";
PAST_DATE = "Thu, 01 Jan 1970 00:00:00 GMT";

class SEKENS
{
	void saveCookie(String key, String val) {
		cookie = new Cookie();
		cookie[key] = val;
		//cookie[key]["expires"] = "exp";
		cookie[key]["path"] = "/";
		OUT << cookie.dump() << EOL;
	}
	
	void deleteCookie(String key) {
		Cookie cookie = new Cookie();
		cookie[key] = "";
		cookie[key]["path"] = "/";
		cookie[key]["expires"] = PAST_DATE;
	}

	String generateSid() {
		return Uuid.getUuid4();
	}
	
	boolean checkCookie(String sid) {
		if () {
			//cookie OK
			return true;
		}
		else {
			//cookie NG
			return false;
		}
	}
	
	void changePage() {
		if () {
			/*
			top.js
			*/
		}
		else {
			/*
			main.js
			*/
		}
	}
}
