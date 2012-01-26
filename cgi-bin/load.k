#!/usr/local/bin/konoha

/*
 * load.k - load script
 *
 * @protocol GET
 * @param sid				sid
 * @param title				title of repository
 * @param name				name of script to load
 * @return json['error']	error message
 * @return json['result']	result message
 * @return json['script']	loaded script
 */

using konoha.json.*;
using konoha.posix.*;
include "settings.k";
include "cgi.k";
include "SEKENS.k";

DEBUG=false;

String err2json(String errtxt) {
	Json j = new Json();
	j["error"] = errtxt;
	return j.stringify();
}

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
		OUT << err2json("Parameter 'name' is not given.") << EOL;
		return;
	}

	String repo_title = cgi.params["title"];
	if (repo_title == null) {
		OUT << err2json("Parameter 'title' is not given.") << EOL;
		return;
	}

	String user_dir = G_USER_DIR + "chen_ji" + "/";
	String script_path = user_dir + script_name;
	String script = SEKENS.loadScript(script_path);
	if (script == "") {
		OUT << err2json("No such script.") << EOL;
		return;
	}

	Json j = new Json();
	j["result"] = "Load Successed.";
	j["script"] = script;
	OUT << j.stringify() << EOL;
}
