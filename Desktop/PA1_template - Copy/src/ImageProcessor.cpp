#include "ImageProcessor.h"
#include <iostream>

ImageProcessor::ImageProcessor() {

}

ImageProcessor::~ImageProcessor() {

}


std::string ImageProcessor::decodeHiddenMessage(const ImageMatrix &img) 
{
	ImageSharpening ImgSharper;
	ImageMatrix SharpenedImage = ImgSharper.sharpen(img, 1.0);
	EdgeDetector EdgeFinder;
	std::vector<std::pair<int, int>> AllEdges = EdgeFinder.detectEdges(SharpenedImage);
	std::string MessageAsBinary;
	for (auto EachPair : AllEdges)
	{
		int Value = SharpenedImage.get_data(EachPair.first, EachPair.second);
		MessageAsBinary += std::to_string(Value % 2);
	}
	while (MessageAsBinary.size() % 7 != 0)
		MessageAsBinary = "0" + MessageAsBinary;
	DecodeMessage MessageConverter;
	std::string MessageAsString = MessageConverter.binaryToASCII(MessageAsBinary);
	std::cout << MessageAsString << std::endl;
	return MessageAsString;

}

ImageMatrix ImageProcessor::encodeHiddenMessage(const ImageMatrix &img, const std::string &message) {
	return img;
}
