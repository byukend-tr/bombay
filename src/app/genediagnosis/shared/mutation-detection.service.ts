import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MutationDetectionService {
  eval: Array<boolean>;
  edit: Array<any>;
  lcs: Array<any>;
  lcs_backtrack: Array<any>;
  edit_val: number;
  lcs_val: number;
  mutation: Array<string>;
  start_at: number;
  stop_at: number;

  // tslint:disable-next-line:max-line-length
  s1 = 'ATGTGGCTCCGGAGCCATCGTCAGCTCTGCCTGGCCTTCCTGCTAGTCTGTGTCCTCTCTGTAATCTTCTTCCTCCATATCCATCAAGACAGCTTTCCACATGGCCTAGGCCTGTCGATCCTGTGTCCAGACCGCCGCCTGGTGACACCCCCAGTGGCCATCTTCTGCCTGCCGGGTACTGCGATGGGCCCCAACGCCTCCTCTTCCTGTCCCCAGCACCCTGCTTCCCTCTCCGGCACCTGGACTGTCTACCCCAATGGCCGGTTTGGTAATCAGATGGGACAGTATGCCACGCTGCTGGCTCTGGCCCAGCTCAACGGCCGCCGGGCCTTTATCCTGCCTGCCATGCATGCCGCCCTGGCCCCGGTATTCCGCATCACCCTGCCCGTGCTGGCCCCAGAAGTGGACAGCCGCACGCCGTGGCGGGAGCTGCAGCTTCACGACTGGATGTCGGAGGAGTACGCGGACTTGAGAGATCCTTTCCTGAAGCTCTCTGGCTTCCCCTGCTCTTGGACTTTCTTCCACCATCTCCGGGAACAGATCCGCAGAGAGTTCACCCTGCACGACCACCTTCGGGAAGAGGCGCAGAGTGTGCTGGGTCAGCTCCGCCTGGGCCGCACAGGGGACCGCCCGCGCACCTTTGTCGGCGTCCACGTGCGCCGTGGGGACTATCTGCAGGTTATGCCTCAGCGCTGGAAGGGTGTGGTGGGCGACAGCGCCTACCTCCGGCAGGCCATGGACTGGTTCCGGGCACGGCACGAAGCCCCCGTTTTCGTGGTCACCAGCAACGGCATGGAGTGGTGTAAAGAAAACATCGACACCTCCCAGGGCGATGTGACGTTTGCTGGCGATGGACAGGAGGCTACACCGTGGAAAGACTTTGCCCTGCTCACACAGTGCAACCACACCATTATGACCATTGGCACCTTCGGCTTCTGGGCTGCCTACCTGGCTGGCGGAGACACTGTCTACCTGGCCAACTTCACCCTGCCAGACTCTGAGTTCCTGAAGATCTTTAAGCCGGAGGCGGCCTTCCTGCCCGAGTGGGTGGGCATTAATGCAGACTTGTCTCCACTCTGGACATTGGCTAAGCCTTGA';
  s2: string;

  constructor(private http: Http) {
  }
  testWithFile(PATH_TO_FILE) {
    this.http.get(PATH_TO_FILE).subscribe(async data => {
      console.log(PATH_TO_FILE);
      this.s2 = await data.text().split('\n')[1];
      console.log(this.s2);
      this.__findMutate();
      console.log('ans: ' + data.text().split('\n')[0] + ', found: ' + this.mutation[0]);
      if (data.text().split('\n')[0] === this.mutation[0]) {
        console.log('Correct!');
      } else {
        console.log('Incorrect!');
      }
      // this.mutation = [];
    });
  }

  initService() {
    this.s2 = 'ATCTGGCTCCGGAGCCATCGTCAGCTCTGCCTGGCCTTCCTGCTAGTCTGTGTCCTCTCTGTAATCTTCTTCCTCCATATCCATCAAGACAGCTTTCCACATGGCCTAGGCCTGTCGATCCTGTGTCCAGACCGCCGCCTGGTGACACCCCCAGTGGCCATCTTCTGCCTGCCGGGTACTGCGATGGGCCCCAACGCCTCCTCTTCCTGTCCCCAGCACCCTGCTTCCCTCTCCGGCACCTGGACTGTCTACCCCAATGGCCGGTTTGGTAATCAGATGGGACAGTATGCCACGCTGCTGGCTCTGGCCCAGCTCAACGGCCGCCGGGCCTTTATCCTGCCTGCCATGCATGCCGCCCTGGCCCCGGTATTCCGCATCACCCTGCCCGTGCTGGCCCCAGAAGTGGACAGCCGCACGCCGTGGCGGGAGCTGCAGCTTCACGACTGGATGTCGGAGGAGTACGCGGACTTGAGAGATCCTTTCCTGAAGCTCTCTGGCTTCCCCTGCTCTTGGACTTTCTTCCACCATCTCCGGGAACAGATCCGCAGAGAGTTCACCCTGCACGACCACCTTCGGGAAGAGGCGCAGAGTGTGCTGGGTCAGCTCCGCCTGGGCCGCACAGGGGACCGCCCGCGCACCTTTGTCGGCGTCCACGTGCGCCGTGGGGACTATCTGCAGGTTATGCCTCAGCGCTGGAAGGGTGTGGTGGGCGACAGCGCCTACCTCCGGCAGGCCATGGACTGGTTCCGGGCACGGCACGAAGCCCCCGTTTTCGTGGTCACCAGCAACGGCATGGAGTGGTGTAAAGAAAACATCGACACCTCCCAGGGCGATGTGACGTTTGCTGGCGATGGACAGGAGGCTACACCGTGGAAAGACTTTGCCCTGCTCACACAGTGCAACCACACCATTATGACCATTGGCACCTTCGGCTTCTGGGCTGCCTACCTGGCTGGCGGAGACACTGTCTACCTGGCCAACTTCACCCTGCCAGACTCTGAGTTCCTGAAGATCTTTAAGCCGGAGGCGGCCTTCCTGCCCGAGTGGGTGGGCATTAATGCAGACTTGTCTCCACTCTGGACATTGGCTAAGCCTCGA';
    // console.log('EDIT = ' + this.edit_val);
    // console.log(this.edit);

    // console.log(this.lcs.length);
    this.__findMutate();
    console.log(this.lcs);
    console.log(this.lcs_backtrack);

    // let path;
    // for (let i = 1; i <= 56; i++) {
    //   path = 'assets/testcase' + ('0' + i).slice(-2) + '.txt';
    //   this.testWithFile(path);
    //   console.log(path);
    // }
  }

  __findMutate() {
    // console.log(this.s1, this.s2);
    this.edit_val = this.__editDistance(this.s1, this.s2);
    this.lcs_val = this.__lcs(this.s1, this.s2);
    // console.log(this.edit_val, this.lcs_val);
    let i = this.lcs.length - 1;
    let j = this.lcs[0].length - 1;
    console.log(this.lcs, i, j);
    const lcs_res = this.lcs[i][j];
    let mutate_pos = this.s1.length - 1;
    this.start_at = -1;
    this.stop_at = -1;

    // S1 longer -> ignore
    const i0 = i;
    while (this.lcs[i][j] === lcs_res) {
      i -= 1;
    }
    i += 1;
    if (i !== i0) { // if i is changed >> s1's tail is longer
      this.stop_at = i; // end point of s2 in s1
    } else {
      this.stop_at = i0;
    }
    // S2 longer -> ignore
    while (this.lcs[i][j] === lcs_res) {
      j -= 1;
      mutate_pos -= 1;
    }
    j += 1;
    mutate_pos += 1;
    this.mutation = new Array<string>();
    while (i > 0 && j > 0) {
      while (this.lcs_backtrack[i][j] === 'C') {
        i -= 1;
        j -= 1;
        mutate_pos -= 1;
      }
      if (i === 0 || j === 0) {
        break;
      }
      if (this.lcs_backtrack[i][j] === 'U') {
        // tslint:disable-next-line:max-line-length
        if (this.lcs[i - 1][j - 1] === this.lcs[i][j]) { // Mutation case , try to get back to normal line
          this.mutation.push((mutate_pos + 1) + this.s1[i - 1] + '>' + this.s2[j - 1]);
          i -= 1;
          j -= 1;
          mutate_pos -= 1;
        } else {
          while (this.lcs_backtrack[i][j] === 'U') {
            this.mutation.push(mutate_pos + 'del' + this.s1[i - 1]);
            i -= 1;
            mutate_pos -= 1;
          }
        }
      } else if (this.lcs_backtrack[i][j] === 'L') {
        // tslint:disable-next-line:max-line-length
        if (this.lcs[i - 1][j - 1] === this.lcs[i][j]) { // Mutation case , try to get back to normal line
          this.mutation.push((mutate_pos + 1) + this.s1[i - 1] + '>' + this.s2[j - 1]);
          i -= 1;
          j -= 1;
          mutate_pos -= 1;
        } else {
          while (this.lcs_backtrack[i][j] === 'L') {
            this.mutation.push(mutate_pos + '_' + (mutate_pos + 1) + 'ins' + this.s2[j - 1]);
            j -= 1;
          }
        }
      }
    }
    console.log(this.mutation[0]);
  }

  __editDistance(s1, s2) {
    const edits = new Array;
    let i, j;
    for (i = 0; i <= s1.length; i++) {
      edits.push([]);
      edits[i][0] = i;
    }
    for (j = 1; j <= s2.length; j++) {
      edits[0][j] = j;
    }
    for (i = 1; i <= s1.length; i++) {
      for (j = 1; j <= s2.length; j++) {
        const u = (s1.charAt(i - 1) === s2.charAt(j - 1) ? 0 : 1);
        edits[i][j] = Math.min(edits[i - 1][j] + 1, Math.min(edits[i][j - 1] + 1, edits[i - 1][j - 1] + u));
      }
    }
    // store table
    this.edit = edits;
    return edits[s1.length][s2.length];
  }
  __lcs(s1, s2) {
    const lcs = new Array; // store the best lcs
    const backtrack = new Array; // store backtrack direction
    let i, j;
    for (i = 0; i <= s1.length; i++) {
      lcs.push([]);
      backtrack.push([]);
      for (j = 0; j <= s2.length; j++) {
        if (i === 0 || j === 0) {
          lcs[i][j] = 0;

          // mark base direction
          if (i === 0 && j === 0) {
            backtrack[i][j] = 'S';
          } else if (i === 0) {
            backtrack[i][j] = 'L';
          } else if (j === 0) {
            backtrack[i][j] = 'U';
          }
        } else if (s1[i - 1] === s2[j - 1]) {
          lcs[i][j] = lcs[i - 1][j - 1] + 1;
          // mark cross decision
          if (lcs[i][j] === lcs[i - 1][j - 1] + 1) {
            backtrack[i][j] = 'C';
          }
        } else {
          lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
          // mark up/left decision
          if (lcs[i - 1][j] >= lcs[i][j - 1]) { // choose from up
            backtrack[i][j] = 'U';
          } else { // choose from left
            backtrack[i][j] = 'L';
          }
        }
      }
    }
    // store table
    this.lcs = lcs;
    this.lcs_backtrack = backtrack;
    return lcs[s1.length][s2.length];
  }
}
