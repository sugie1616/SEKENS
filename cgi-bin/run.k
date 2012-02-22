#!/usr/local/bin/konoha

/*
 * run.k - run script
 *
 * @protocol POST
 * @param cookie['SID']		sid
 * @param title				title of repository
 * @param name				script name
 * @return json['result']	result message
 * @return json['error']	error message
 */

include "SEKENS.k";

class Run
{
	String user;
	String repo;
	String script;

	Run(String username, String reponame, String scriptname) {
		_user = username;
		_repo = reponame;
		_script = scriptname;
	}
	
	String evalKonoha() {
		String script_path = G_USER_DIR + user + "/" + repo + "/" + script;
		String cmd = "export JS_GEN_HTML=false; export JS_USE_WORKER=true; ";
        cmd += "export JS_USE_INDENT=true; /usr/local/bin/konohac --emit-js ";
		String resultcode = exec(cmd + script_path);
		return resultcode;
	}
}

void main() {
	OUT.println("Content-Type: text/javascript\n");
	Cgi cgi = new Cgi();

	String[] files = [
		"../js/konoha.js",
		"../js/konoha.math.js",
		//"../js/jquery-1.7.1.min.js",
		"../js/js.js",
		"../js/js.dom.js",
		"../js/js.jquery.js",
		"../js/worker.js"
	];

	foreach (String file in files) {
		InputStream ins = new InputStream(file);
		foreach (String line in ins) {
			OUT.println(line);
		}
		OUT.println();
		OUT.flush();
	}

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
	if (j == null) {
		OUT << SEKENS.err2json("SID is not exist") << EOL;
		return;
	}
	String username = j["username"];

	Run run = new Run(username, repo_title, script_name);
	OUT << run.evalKonoha() << EOL;
}
