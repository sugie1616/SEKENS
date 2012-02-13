#!/usr/local/bin/konoha

/*
 * create.k - create a new git repository
 *
 * @protocol POST
 * @param cookie['SID']		sid
 * @param title				title of new repository
 * @param desc				description of new repository
 * @param script			script of sample program
 * @param json['success']	true if successed
 * @return json['msg']		result message
 * @return json['error']	error message
 */

include "SEKENS.k";
include "git.k";

DEBUG=false;

void main(String[] args)
{
	if (DEBUG) {
		OUT << "Content-Type: text/plain\n" << EOL;
	} else {
		OUT << "Content-Type: application/json;charset=UTF-8\n" << EOL;
	}

	Cgi cgi = new Cgi();

	String repo_title = cgi.params["title"];
	if (repo_title == null) {
		j = new Json();
		j["success"] = "false";
		j["msg"] = "Parameter 'title' is not given.";
		OUT << j.stringify() << EOL;
		return;
	}

	String repo_desc = cgi.params["desc"];
	if (repo_desc == null) {
		j = new Json();
		j["success"] = "false";
		j["msg"] = "Parameter 'desc' is not given.";
		OUT << j.stringify() << EOL;
		return;
	}

	String subj_script = cgi.params["script"];
	if (subj_script == null) {
		j = new Json();
		j["success"] = "false";
		j["msg"] = "Parameter 'script' is not given.";
		OUT << j.stringify() << EOL;
		return;
	}

	String sid = cgi.cookies["SID"]["val"];
	if (sid == null) {
		j = new Json();
		j["success"] = "false";
		j["msg"] = "sid is not found";
		OUT << j.stringify() << EOL;
		return;
	}

	Json j = SEKENS.checkSID(sid);
	String username = j["username"];
	if (username == null) {
		j = new Json();
		j["success"] = "false";
		j["msg"] = "username is not found";
		OUT << j.stringify() << EOL;
		return;
	}

	String create_dir = G_GIT_DIR + repo_title + "/";
	if (mkdir(create_dir, 0775) == false) {
		j = new Json();
		j["success"] = "false";
		j["msg"] = "mkdir '" + create_dir + "' failed";
		OUT << j.stringify() << EOL;
		return;
	}

	String gitdir = create_dir + ".git";

	Git git = new Git(gitdir);
	git.init();

	j = new Json();
	j["success"] = "true";
	j["msg"] = "create repository successed";
	OUT << j.stringify() << EOL;
}
