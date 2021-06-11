// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import "./AnimalControl.sol";
import "./animals.sol";
import "./SaleClockAuction.sol";

contract AnimalBase is AnimalControl {

    /// @dev The Birth event is fired whenever a new kitten comes into existence. This obviously
    ///  includes any time a animal is created through the giveBirth method, but it is also called
    ///  when a new gen0 animal is created.
    event Birth(
        address owner,
        uint256 animalId,
        uint256 matronId,
        uint256 sireId,
        Species species,
        uint8 genes,
        uint8 generation
    );

    /// @dev Transfer event as defined in current draft of ERC721. Emitted every time a kitten
    ///  ownership is assigned, including births.
    // event Transfer(address from, address to, uint256 tokenId);    


    struct Animal {
        uint8 genes;
        uint256 matronId;
        uint256 sireId;
        Species species;
        uint8 generation;
    }

    /// @dev A lookup table indianimaling the cooldown duration after any successful
    ///  breeding action, called "pregnancy time" for matrons and "siring cooldown"
    ///  for sires. Designed such that the cooldown roughly doubles each time a animal
    ///  is bred, encouraging owners not to just keep breeding the same animal over
    ///  and over again. Caps out at one week (a animal can breed an unbounded number
    ///  of times, and the maximum cooldown is always seven days).
    uint32[14] public cooldowns = [
        uint32(4 hours),
        uint32(1 days),
        uint32(3 days),
        uint32(7 days),
        uint32(30 days)
    ];

    // An approximation of currently how many seconds are in between blocks.
    uint256 public secondsPerBlock = 15;

    // list of existing animals
    Animal[] public animals;

    /// @dev A mapping from animal IDs to the address that owns them. All animals have
    ///  some valid owner address, even gen0 animals are created with a non-zero owner.
    mapping (uint256 => address) public animalIndexToOwner;

    // @dev A mapping from owner address to count of tokens that address owns.
    //  Used internally inside balanceOf() to resolve ownership count.
    mapping (address => uint256) ownershipTokenCount;

    /// @dev A mapping from AddressIDs to an address that has been approved to call
    ///  transferFrom(). Each Address can only have one approved address for transfer
    ///  at any time. A zero value means no approval is outstanding.
    mapping (uint256 => address) public animalIndexToApproved;

    /// @dev A mapping from AddressIDs to an address that has been approved to use
    ///  this Address for siring via breedWith(). Each Address can only have one approved
    ///  address for siring at any time. A zero value means no approval is outstanding.
    mapping (uint256 => address) public sireAllowedToAddress;    

    /// @dev The address of the ClockAuction contract that handles sales of Kitties. This
    ///  same contract handles both peer-to-peer sales as well as the gen0 sales which are
    ///  initiated every 15 minutes.
    SaleClockAuction public saleAuction;
}