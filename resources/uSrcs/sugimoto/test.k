int fibo(int n) {
	if (n < 3) {
		return 1;
	}
	else {
		return fibo(n - 2) + fibo(n - 1);
	}
}

int i = 10;
print fibo(i);
