class Git {
	String path;
	String git_dir;
	String cmd;
	String home;

	Git(String gitdir) {
		_path = exec("which git").split("\n")[0];
		if (path == "") {
			throw new Script!!("git is not installed");
		}
		_git_dir = gitdir;
		if (git_dir == null) {
			cmd = path;
			home = ".";
		} else {
			if (git_dir.endsWith("/")) {
				_git_dir = git_dir.substring(0, git_dir.size - 1);
			}
			cmd = path + " --git-dir=" + git_dir;
			home = git_dir.substring(0, git_dir.size - 4);
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
