import random
def main():
    fut1 = 'ATGTGGCTCCGGAGCCATCGTCAGCTCTGCCTGGCCTTCCTGCTAGTCTGTGTCCTCTCTGTAATCTTCTTCCTCCATATCCATCAAGACAGCTTTCCACATGGCCTAGGCCTGTCGATCCTGTGTCCAGACCGCCGCCTGGTGACACCCCCAGTGGCCATCTTCTGCCTGCCGGGTACTGCGATGGGCCCCAACGCCTCCTCTTCCTGTCCCCAGCACCCTGCTTCCCTCTCCGGCACCTGGACTGTCTACCCCAATGGCCGGTTTGGTAATCAGATGGGACAGTATGCCACGCTGCTGGCTCTGGCCCAGCTCAACGGCCGCCGGGCCTTTATCCTGCCTGCCATGCATGCCGCCCTGGCCCCGGTATTCCGCATCACCCTGCCCGTGCTGGCCCCAGAAGTGGACAGCCGCACGCCGTGGCGGGAGCTGCAGCTTCACGACTGGATGTCGGAGGAGTACGCGGACTTGAGAGATCCTTTCCTGAAGCTCTCTGGCTTCCCCTGCTCTTGGACTTTCTTCCACCATCTCCGGGAACAGATCCGCAGAGAGTTCACCCTGCACGACCACCTTCGGGAAGAGGCGCAGAGTGTGCTGGGTCAGCTCCGCCTGGGCCGCACAGGGGACCGCCCGCGCACCTTTGTCGGCGTCCACGTGCGCCGTGGGGACTATCTGCAGGTTATGCCTCAGCGCTGGAAGGGTGTGGTGGGCGACAGCGCCTACCTCCGGCAGGCCATGGACTGGTTCCGGGCACGGCACGAAGCCCCCGTTTTCGTGGTCACCAGCAACGGCATGGAGTGGTGTAAAGAAAACATCGACACCTCCCAGGGCGATGTGACGTTTGCTGGCGATGGACAGGAGGCTACACCGTGGAAAGACTTTGCCCTGCTCACACAGTGCAACCACACCATTATGACCATTGGCACCTTCGGCTTCTGGGCTGCCTACCTGGCTGGCGGAGACACTGTCTACCTGGCCAACTTCACCCTGCCAGACTCTGAGTTCCTGAAGATCTTTAAGCCGGAGGCGGCCTTCCTGCCCGAGTGGGTGGGCATTAATGCAGACTTGTCTCCACTCTGGACATTGGCTAAGCCTTGA'

    # print(random.randrange(1000,1098))
    n = 50
    replace = 3
    for i in range(n):
        for j in range(replace):
            cut_pos = random.randrange(1000,1098)
            replace_pos = random.randrange(0,cut_pos)
            replace_char = random.randrange(0,3)
            if(j==0):
                fut1_cut = fut1[:cut_pos]
            else:
                fut1_cut = fut1_cut[:cut_pos]
                
            point = ['A','T','C','G']
            ori = fut1[replace_pos]
            point.remove(ori)
            replace_char = point[replace_char]
            fut1_cut = fut1_cut[:replace_pos] + str(replace_char) + fut1_cut[replace_pos+1:]
            if(j==0):
                mutate_pos = str (replace_pos+1)+fut1[replace_pos]+'>'+replace_char
            else:
                mutate_pos += ' ' + str (replace_pos+1)+fut1[replace_pos]+'>'+replace_char
                

        # print(cut_pos,fut1[replace_pos],fut1_cut[replace_pos] ,mutate_pos,len(fut1_cut))
        # print(mutate_pos,fut1_cut,sep='\n')

        file = open('testcaseC'+str(i).zfill(2) +'.txt','w')
        file.write(mutate_pos+'\n'+fut1_cut)
        file.close()



if __name__ == "__main__":
    main()
