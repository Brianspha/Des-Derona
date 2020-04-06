pragma solidity >=0.5.0;
/**@dev contract definition */

contract DesDarona {
    /**======================================================= Structs Definition/**=======================================================*/
    /**======================================================= Modifier Definition/**=======================================================*/
    /**======================================================= Variables Definition/**=======================================================*/
    mapping(address => uint256) playerScores;
    address[] playerIds;
    /**======================================================= Functions Definition/**=======================================================*/
    constructor() public {

    }
    function registerScore(uint256 score) public returns(bool){
        require(msg.sender != address(0),"Invalid sender address");
        playerScores[msg.sender]=score;
        return true;
    }
    function getPlayerIds() public view returns(address [] memory){

    }

}