#!/usr/local/bin/konoha

/*
 * save.k - save posted script
 *
 * @protocol POST
 * @param cookie['SID']		sid
 * @param title				title of repository
 * @param name				name of script to commit
 * @param script			script body
 * @return json['result']	result message
 * @return json['error']	error message
 */

include "SEKENS.k";

void main(String[] args)
{
	OUT << "Content-Type: application/json;charset=UTF-8\n" << EOL;

	Cgi cgi = new Cgi();

	String sid = cgi.cookies["SID"]["val"];
	Json j = SEKENS.checkSID(sid);
	if (j == null) {
		OUT << err2json("SID is not exist") << EOL;
		return;
	}
	String username = j["username"];

	String script_name = cgi.params["name"];
	if (script_name == null) {
		OUT << err2json("Parameter 'name' is not given.") << EOL;
		return;
	}

	String script_body = cgi.params["script"];
	if (script_body == null) {
		OUT << err2json("Parameter 'script' is not given.") << EOL;
		return;
	}

	String repo_title = cgi.params["title"];
	if (repo_title == null) {
		OUT << err2json("Parameter 'title' is not given.") << EOL;
		return;
	}

	String user_dir = G_USER_DIR + username + "/";
	String script_path = user_dir + repo_title + "/" + script_name;

	Json j = new Json();
	if (SEKENS.saveScript(script_path, script_body)) {
		j["result"] = "Save successed.";
	} else {
		j["error"] = "No need to push.";
	}
	OUT << j.stringify() << EOL;
}
