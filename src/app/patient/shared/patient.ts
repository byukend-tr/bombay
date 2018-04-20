export class Patient {
    id: string;
    minit: string;
    fName: string;
    lName: string;
    birthDay: Date;
    age: Int16Array;
    tel1: string;
    tel2: string;
    address: string;
    province: string;
    district: string;
    subDistrict: string;
    zip: string;

    dateTimeNow: string;

    idAbo: string;
    resultAbo: string;
    idAntibody: string;
    resultAntibody: string;
    idSaliva: string;
    resultSaliva: string;

    antiA: string;
    antiB: string;
    antiAB: string;
    aCell: string;
    BCell: string;
    OCell: string;
    groupAbo: string;
    photoAbo: Array<any>;

    rt1: string;
    c1: string;
    ahg1: string;
    ccc1: string;
    rt2: string;
    c2: string;
    ahg2: string;
    ccc2: string;
    antibody: string;
    photoAntibody: Array<any>;

    secretor: string;
    nonSecretor: string;
    nss: string;
    testAntiA: string;
    testAntiB: string;
    testAntiH: string;
    groupSaliva: string;
    photoSaliva: Array<any>;
}
