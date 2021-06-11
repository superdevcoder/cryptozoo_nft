// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./animals.sol";
import "./AnimalBase.sol";

contract CryptoZoo is ERC721, AnimalBase {
  uint256 public tokenCounter;

  
  

  mapping(uint256 => Species) tokenIdToSpecies;
  mapping(uint256 => uint8) tokenIdToGeneration;

  constructor() ERC721("CryptoZoo", "ZOO") {
    tokenCounter = 1;
  }
  
  function max(uint8 a, uint8 b) private pure returns (uint8) {
        return a > b ? a : b;
  }

  /** @dev Function to create a new animal
    * @param matron ID of new animal's matron (one parent)
    * @param sire ID of new animal's sire (other parent)
    * @param animalOwner Address of new animal's owner
    * @return The new animal's ID
    */
  function createAnimal(
      uint256 matron,
      uint256 sire,
      address animalOwner
  )
      internal
      returns (uint)
  {
      // contract shouldn't own the animal. 
      require(animalOwner != address(0));
      Species nextSpecies = Species.MUTANT;
      uint8 nextGeneration = 0;
      // if it is a new egg, then hatch the pure animal, in this case the 
      // matron and sire will be 0: 
      if (matron == sire && matron == 0){
        // get the next available species
        nextSpecies = Species((tokenCounter) % uint(Species.BEAR) + 1);
      } else  {
        Species matronSpecies = tokenIdToSpecies[matron];
        Species sireSpecies = tokenIdToSpecies[sire];
        if( sireSpecies == matronSpecies){
          // next species is the same as the parents apes make apes. 
          nextSpecies = tokenIdToSpecies[matron]; 
        }
        // generation is the latest of the parents. 
        nextGeneration = max(tokenIdToGeneration[matron], tokenIdToGeneration[sire]) + 1;
      }

      uint8 newGenes = generateAnimalGenes(matron, sire);
      uint256 newAnimalId = tokenCounter;

      Animal memory newAnimal = Animal({
          genes: newGenes,
          matronId: matron,
          sireId: sire,
          species: nextSpecies,
          generation: nextGeneration
      });

      animals.push(newAnimal);
      tokenIdToGeneration[newAnimalId] = nextGeneration;
      tokenIdToSpecies[newAnimalId] = nextSpecies;
      tokenCounter = tokenCounter + 1;

      super._mint(animalOwner, newAnimalId);
      emit Birth(
          animalOwner,
          newAnimalId,
          newAnimal.matronId,
          newAnimal.sireId,
          newAnimal.species,
          newAnimal.genes,
          newAnimal.generation
      );
       return newAnimalId;
  }

  /** @dev Function to allow user to buy a new animal (calls createAnimal())
    * @return The new animal's ID
    */
  function buyAnimal() external payable returns (uint256) {
      require(msg.value == 0.1 ether);
      return createAnimal(0, 0, msg.sender);
  }
    
  /** @dev Function to breed 2 animals to create a new one
    * @param matronId ID of new animal's matron (one parent)
    * @param sireId ID of new animal's sire (other parent)
    * @return The new animal's ID
    */
  function breedAnimals(uint256 matronId, uint256 sireId) external payable returns (uint256) {
      // get matron and sire species and make sure they are not the same. 
      require(msg.value == 0.05 ether);

      // mutants can't mate. 
      require(tokenIdToSpecies[matronId] != Species.MUTANT);
      require(tokenIdToSpecies[sireId] != Species.MUTANT);

      // create animal
      return createAnimal(matronId, sireId, msg.sender);
  }
    
  /** @dev Function to retrieve a specific animal's details.
    * @param animalId ID of the animal who's details will be retrieved
    * @return An array, [animal's ID, animal's genes, matron's ID, sire's ID]
    */
  function getAnimalDetails(uint256 animalId) external view returns (uint256, uint8, uint256, uint256, Species) {
      Animal storage animal = animals[animalId];
      return (animalId, animal.genes, animal.matronId, animal.sireId, animal.species);
  }
    
  /** @dev Function to get a list of owned animals' IDs
    * @return A uint array which contains IDs of all owned animals
    */
  function ownedAnimals() external view returns(uint256[] memory) {
      uint256 animalCount = balanceOf(msg.sender);
      if (animalCount == 0) {
          return new uint256[](0);
      } else {
          uint256[] memory result = new uint256[](animalCount);
          uint256 totalAnimals = animals.length;
          uint256 resultIndex = 0;
          uint256 animalId = 0;
          while (animalId < totalAnimals) {
              if (ownerOf(animalId) == msg.sender) {
                  result[resultIndex] = animalId;
                  resultIndex = resultIndex + 1;
              }
              animalId = animalId + 1;
          }
          return result;
      }
  }

  fallback() external payable {
    // TODO
  }

  receive() external payable {
  }  

}
