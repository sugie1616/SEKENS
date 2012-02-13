class Git {
	String path;
	String gitdir;
	String cmd;
	String home;

	Git(String gitdir) {
		_path = exec("which git").split("\n")[0];
		if (path == "") {
			throw new Script!!("git is not installed");
		}
		_gitdir = gitdir;
		if (gitdir == null) {
			cmd = path;
			home = ".";
		} else {
			if (gitdir.endsWith("/")) {
				_gitdir = gitdir.substring(0, gitdir.size - 1);
			}
			cmd = path + " --git-dir=" + gitdir;
			home = gitdir.substring(0, gitdir.size - 4);
		}
	}

	String add(Path file) {
		return exec(cmd + " add " + file);
	}

	String push() {
		return exec(cmd + " push");
	}

	String commit(String msg) {
		return exec(cmd + " commit -m '" + msg + "'");
	}

	String pull() {
		return exec(cmd + " pull");
	}

	String status() {
		return exec("cd " + home + " && " + cmd + " status");
	}

	String diff() {
		return exec("cd " + home + " && " + cmd + " diff");
	}

	String init() {
		return exec(cmd + " --bare init");
	}
}
