#!/usr/local/bin/konoha

/*
 * push.k - push & commit script
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
include "git.k";

DEBUG=false;

String err2json(String errtxt)
{
	Json j = new Json();
	j["error"] = errtxt;
	return j.stringify();
}

boolean pushScript(Git git, Path script_path)
{
	if (DEBUG) {
		print "push " + script_path;
	}
	git.add(script_path);
	if (git.diff() != "") {
		git.commit("commited automatically");
		git.push();
	} else {
		return false;
	}
	return true;
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

	String sid = cgi.cookies["SID"]["val"];
	Json j = SEKENS.checkSID(sid);
	if (j == null) {
		OUT << err2json("SID is not exist") << EOL;
		return;
	}
	String username = j["username"];

	String user_sources_dir = G_USER_DIR + username + "/sources/";
	String script_path = user_sources_dir + script_name;
	SEKENS.saveScript(script_path, script_body);

	Git git = new Git(user_sources_dir + repo_title + "/.git");
	String result = "";
	if (pushScript(git, script_path)) {
		result = "Push successed.";
	} else {
		result = "No need to push.";
	}

	Json j = new Json();
	j["result"] = result;
	OUT << j.stringify() << EOL;
}
