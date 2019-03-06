pragma solidity ^0.4.25;

contract EMPContract {

    //Used to store the personal details
    struct PersonalInfo {
        bytes32 empUid;
        bytes32 empId;
        string empFName;
        string empLName;
        string empAvatar;
        string fatherName;
        bytes32 gender;
        bytes32 dateOfBirth;
        bytes32 qualification;
        bytes32 aadhaar;
        bytes32 companyId;
    }

    //Used to store the employment details
    struct EmploymentInfo {
        bytes32 dateOfJoining;
        bytes32 dateOfRelieving;
        bytes32 employmentType;
        bytes32 exitType;
        string technicalExpertise;
        string designation;
        bytes32 verificationFlag;
        bytes32 publishedDate;
    }

    //Employee reference variable        
    PersonalInfo[] public personalInfoList;
    EmploymentInfo[] public employmentInfoList;
     
    /**
     * This method is used to add the employee details.
     * */
    function addEmpPersonalInfo(string empUid, string empId, string empFName, string empLName, 
                        string empAvatar, string fatherName, string gender, string dateOfBirth, 
                        string qualification, string aadhaar, string companyId) public returns (bool) {  
          
                PersonalInfo memory newEMPPersonal = PersonalInfo({
                empUid: stringToBytes32(empUid),
                empId: stringToBytes32(empId),
                empFName: empFName,
                empLName: empLName,
                empAvatar: empAvatar,
                fatherName: fatherName,
                gender: stringToBytes32(gender),
                dateOfBirth: stringToBytes32(dateOfBirth),
                qualification: stringToBytes32(qualification),
                aadhaar: stringToBytes32(aadhaar),
                companyId: stringToBytes32(companyId)
            });
            personalInfoList.push(newEMPPersonal);
    }
    
     function addEmpProfInfo(string dateOfJoining, string dateOfRelieving, 
                        string employmentType, string exitType, string technicalExpertise, string designation, 
                        string verificationFlag, string publishedDate) public returns (bool) {  
          
                EmploymentInfo memory newEMPEmployment = EmploymentInfo({
                dateOfJoining: stringToBytes32(dateOfJoining),
                dateOfRelieving: stringToBytes32(dateOfRelieving),
                employmentType: stringToBytes32(employmentType),
                exitType: stringToBytes32(exitType),
                technicalExpertise: technicalExpertise,
                designation: designation,
                verificationFlag: stringToBytes32(verificationFlag),
                publishedDate: stringToBytes32(publishedDate)
            });
            employmentInfoList.push(newEMPEmployment);
            return true;
    }
   
    /**
     * This method is used to get the count of employees.
     * */     
    function getCountOfEmployees() public view returns (uint) {
        return personalInfoList.length;
    }  

    /**
     * This method is used to get the count of employees.
     * */     
    function getEmpProfCount() public view returns (uint) {
        return employmentInfoList.length;
    } 
  
    function getUser() public view returns (address)  {
        return msg.sender;
    }
    

    function stringToBytes32(string memory source) public pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }
}

