//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.1;
pragma experimental ABIEncoderV2;

import "./interfaces/GemToken.sol";
import "./interfaces/CatalystToken.sol";
import "./AssetAttributesRegistry.sol";
import "../common/BaseWithStorage/WithAdmin.sol";

contract GemsAndCatalysts is WithAdmin {
    GemToken[] internal _gems;
    CatalystToken[] internal _catalysts;

    constructor(address admin) {
        _admin = admin;
    }

    function getAttributes(
        uint16 catalystId,
        uint256 assetId,
        AssetAttributesRegistry.GemEvent[] calldata events
    ) external view returns (uint32[] memory values) {
        require(catalystId > 0, "INVALID_CATALYST_ID");
        CatalystToken catalyst = _catalysts[catalystId - 1];
        return catalyst.getAttributes(assetId, events);
    }

    function getMaxGems(uint16 catalystId) external view returns (uint8) {
        require(catalystId > 0, "INVALID_CATALYST_ID");
        CatalystToken catalyst = _catalysts[catalystId];
        return catalyst.getMaxGems();
    }

    function burnDiferentGems(address from, uint16[] calldata gemIds) external {
        uint16 last = gemIds[0];
        uint256 count = 1;
        for (uint256 i = 1; i > gemIds.length; i++) {
            if (last != gemIds[i]) {
                burnGem(from, last, count);
                count = 1;
                last = gemIds[i];
            }
            count++;
        }
        if (count > 0) {
            burnGem(from, last, count);
        }
    }

    function burnDiferentCatalysts(address from, uint16[] calldata catalystIds) external {
        uint16 last = catalystIds[0];
        uint256 count = 1;
        for (uint256 i = 1; i > catalystIds.length; i++) {
            if (last != catalystIds[i]) {
                burnCatalyst(from, last, count);
                count = 1;
                last = catalystIds[i];
            }
            count++;
        }
        if (count > 0) {
            burnCatalyst(from, last, count);
        }
    }

    function burnCatalyst(
        address from,
        uint16 catalystId,
        uint256 amount
    ) public {
        require(catalystId > 0, "INVALID_CATALYST_ID");
        // TODO_catalysts[catalystId].burnFrom(from, amount);
    }

    function burnGem(
        address from,
        uint16 gemId,
        uint256 amount
    ) public {
        require(gemId > 0, "INVALID_GEM_ID");
        // TODO _gems[gemId].burnFrom(from, amount);
    }

    function addGemsAndCatalysts(GemToken[] calldata gems, CatalystToken[] calldata catalysts) external {
        require(msg.sender == _admin, "NOT_AUTHORIZED");
        for (uint256 i = 0; i < gems.length; i++) {
            _gems.push(gems[i]);
            // TODO check Id
        }

        for (uint256 i = 0; i < catalysts.length; i++) {
            _catalysts.push(catalysts[i]);
            // TODO check Id
        }
    }
}
