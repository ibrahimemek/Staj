// DecodeMessage.cpp

#include "DecodeMessage.h"
#include <iostream>
#include <sstream>
#include <bitset>

// Default constructor
DecodeMessage::DecodeMessage() {
    // Nothing specific to initialize here
}

// Destructor
DecodeMessage::~DecodeMessage() {
    // Nothing specific to clean up
}




std::string DecodeMessage::binaryToASCII(const std::string& binaryString)
{
    // @todo change basically
    std::stringstream sstream(binaryString);
    std::string output;
    while (sstream.good())
    {
        std::bitset<8> EachBit;
        sstream >> EachBit;
        unsigned long CurrentBitValue = EachBit.to_ulong();
        if (CurrentBitValue <= 32) CurrentBitValue += 33;
        if (CurrentBitValue > 126) CurrentBitValue = 126;
        char c = char(CurrentBitValue);
        output += c;
    }
    return output;
}

