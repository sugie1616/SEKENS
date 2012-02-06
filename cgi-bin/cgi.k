using konoha.conv.*;

class Cookie
{
	Map<string,Map<string,string>> m;

	Cookie(string arg) {
		m = new Map<string,Map<string,string>>(0);
		if (arg != "") {
			string[] a = arg.replace($/ /, "").split(";");
			foreach (string s in a) {
				string[] kv = s.split("=");
				m[kv[0]] = {"val": kv[1], "expires": "", "path": ""};
			}
		}
	}

	void set(string key, string val) {
		m[key] = {"val": val, "expires": "", "path": ""};
	}

	Map<string,string> get(string key) {
		return m[key];
	}

	void delete(String key) {
		this[key] = "";
		this[key]["expires"] = "Thu, 01 Jan 1970 00:00:00 GMT";
		if (this[key]["path"] == null) {
			this[key]["path"] = "/";
		}
	}

	string dump(void) {
		string ret = "";
		foreach (string key in m.keys()) {
			ret += "Set-Cookie: ";
			ret += key + "=" + m[key]["val"];
			if (m[key]["expires"] != "") {
				ret += "; expires=" + m[key]["expires"];
			}
			if (m[key]["path"] != "") {
				ret += "; Path=" + m[key]["path"];
			}
			ret += "\n";
		}
		return ret;
	}
}

class Cgi
{
	Map<String> params;
	String method;
	Cookie cookies;

	/* private */
	Map<String> parseQuery(String input) {
		Map<String> m = {};
		foreach (String param in input.split("&")) {
			String[] k_v = param.split("=");
			m[k_v[0]] = k_v[1].convert(to:durl);
		}
		return m;
	}

	Cgi(String request_method) {
		_method = $env.REQUEST_METHOD;
		if (request_method != null && request_method != method) {
			throw new Script!!("request method is not match");
		}
		String query = "";
		if (method == "POST") {
			query = System.readLine();
		} else if (method == "GET") {
			query = $env.QUERY_STRING;
		} else {
			throw new Script!!("unknown method '" + method + "'");
		}
		_params = parseQuery(query);
		_cookies = new Cookie($env.HTTP_COOKIE);
	}
}
