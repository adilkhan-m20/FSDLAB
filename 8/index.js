function vowelCount(str) {
  const vowels = { a: 0, e: 0, i: 0, o: 0, u: 0 };
  str = str.toLowerCase();

  for (let ch of str) {
    if (vowels.hasOwnProperty(ch)) {
      vowels[ch]++;
    }
  }

  console.log(
    `a, e, i, o, and u appear, respectively, ${vowels.a}, ${vowels.e}, ${vowels.i}, ${vowels.o}, ${vowels.u} times`
  );
}

// Example call
vowelCount("Le Tour de France");
