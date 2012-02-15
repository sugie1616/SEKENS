#!/usr/local/bin/konoha

/*
 * load.k - load script
 *
 * @protocol GET
 * @param cookie['SID']		sid
 * @param title				title of repository
 * @param name				name of script to load
 * @param type				'subject' or 'answer'
 * @return json['error']	error message
 * @return json['result']	result message
 * @return json['script']	loaded script
 */

include "SEKENS.k";

DEBUG=false;

void main(String[] args)
{
	if (DEBUG) {
		OUT << "Content-Type: text/plain\n" << EOL;
	} else {
		OUT << "Content-Type: application/json;charset=UTF-8\n" << EOL;
	}

	Cgi cgi = new Cgi();

	String script_name = cgi.params["name"];
	if (script_name == null) {
		OUT << SEKENS.err2json("Parameter 'name' is not given.") << EOL;
		return;
	}

	String repo_title = cgi.params["title"];
	if (repo_title == null) {
		OUT << SEKENS.err2json("Parameter 'title' is not given.") << EOL;
		return;
	}

	String sid = cgi.cookies["SID"]["val"];
	Json j = SEKENS.checkSID(sid);
	String user_name = j["username"];

	String type = cgi.params["type"];
	if (type == "subject") {
		String script_path = G_GIT_DIR + repo_title + "/" + script_name;
	} else {
		String user_dir = G_USER_DIR + user_name + "/";
		String script_path = user_dir + repo_title + "/" + script_name;
		String script = SEKENS.loadScript(script_path);
		if (script == "") {
			OUT << SEKENS.err2json("No such script.") << EOL;
			return;
		}
		Json j = new Json();
		j["result"] = "Load Successed.";
		j["script"] = script;
		OUT << j.stringify() << EOL;
	}
}
