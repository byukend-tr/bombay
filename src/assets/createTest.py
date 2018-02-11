def main():
    fut1 = 'ATGTGGCTCCGGAGCCATCGTCAGCTCTGCCTGGCCTTCCTGCTAGTCTGTGTCCTCTCTGTAATCTTCTTCCTCCATATCCATCAAGACAGCTTTCCACATGGCCTAGGCCTGTCGATCCTGTGTCCAGACCGCCGCCTGGTGACACCCCCAGTGGCCATCTTCTGCCTGCCGGGTACTGCGATGGGCCCCAACGCCTCCTCTTCCTGTCCCCAGCACCCTGCTTCCCTCTCCGGCACCTGGACTGTCTACCCCAATGGCCGGTTTGGTAATCAGATGGGACAGTATGCCACGCTGCTGGCTCTGGCCCAGCTCAACGGCCGCCGGGCCTTTATCCTGCCTGCCATGCATGCCGCCCTGGCCCCGGTATTCCGCATCACCCTGCCCGTGCTGGCCCCAGAAGTGGACAGCCGCACGCCGTGGCGGGAGCTGCAGCTTCACGACTGGATGTCGGAGGAGTACGCGGACTTGAGAGATCCTTTCCTGAAGCTCTCTGGCTTCCCCTGCTCTTGGACTTTCTTCCACCATCTCCGGGAACAGATCCGCAGAGAGTTCACCCTGCACGACCACCTTCGGGAAGAGGCGCAGAGTGTGCTGGGTCAGCTCCGCCTGGGCCGCACAGGGGACCGCCCGCGCACCTTTGTCGGCGTCCACGTGCGCCGTGGGGACTATCTGCAGGTTATGCCTCAGCGCTGGAAGGGTGTGGTGGGCGACAGCGCCTACCTCCGGCAGGCCATGGACTGGTTCCGGGCACGGCACGAAGCCCCCGTTTTCGTGGTCACCAGCAACGGCATGGAGTGGTGTAAAGAAAACATCGACACCTCCCAGGGCGATGTGACGTTTGCTGGCGATGGACAGGAGGCTACACCGTGGAAAGACTTTGCCCTGCTCACACAGTGCAACCACACCATTATGACCATTGGCACCTTCGGCTTCTGGGCTGCCTACCTGGCTGGCGGAGACACTGTCTACCTGGCCAACTTCACCCTGCCAGACTCTGAGTTCCTGAAGATCTTTAAGCCGGAGGCGGCCTTCCTGCCCGAGTGGGTGGGCATTAATGCAGACTTGTCTCCACTCTGGACATTGGCTAAGCCTTGA'

    fut1_cap = fut1.upper()
    mutation = [[],
    [35,'C','T'],
    [293,'C','T'],
    [328,'G','A'],
    [349,'C','T'],
    [442,'G','T'],
    [460,'T','C'],
    [],
    [491,'T','A'],
    [522,'C','A'],
    [658,'C','T'],
    [659,'G','A'],
    [661,'C','T'],
    [682,'A','G'],
    [689,'A','C'],
    [721,'T','C'],
    [801,'G','C'],
    [801,'G','T'],
    [832,'G','A'],
    [],
    [917,'C','T'],
    [],
    [235,'G','C'],
    [991,'C','A'],
    [424,'C','T'],
    [649,'G','T'],
    [235,'G','C'],
    [545,'G','A'],
    [958,'G','A'],
    [896,'A','C'],
    [655,'G','C'],
    [269,'G','T'],
    [371,'T','G'],
    [682,'A','G'],
    [980,'A','C'],
    [748,'C','T'],
    [422,'G','A'],
    [461,'A','G'],
    [462,'C','A'],
    [513,'G','C'],
    [538,'C','T'],
    [],
    [586,'C','T'],
    [695,'G','A'],
    [725,'T','G'],
    [776,'T','A'],
    [],
    [826,'C','T'],
    [],
    [944,'C','T'],
    [948,'C','G'],
    [980,'A','C'],
    [1047,'G','C'],
    [684,'G','A'],
    [694,'T','C'],
    [],
    [423,'G','A']]   
    
    for i in range(len(mutation)):
        if len(mutation[i]) == 0:
            file = open('testcase'+str(i).zfill(2) +'.txt','w')
            file.close()
            continue
        pos = mutation[i][0]
        success = 0
        init = mutation[i][1]
        replace = mutation[i][2]
        ans = str(pos)+init+'>'+replace
        fut1_replace = ''
        if fut1_cap[pos-1] == init:
            success = 1
            fut1_replace = fut1_cap[:pos-1]+replace+fut1_cap[pos:]
            file = open('testcase'+str(i).zfill(2) +'.txt','w')
            file.write(ans+'\n'+fut1_replace)
            file.close()
        else:
            print('Error position')
        if not success:
            print('init wrong')
    # print(fut1_replace, ans)

if __name__ == "__main__":
    main()