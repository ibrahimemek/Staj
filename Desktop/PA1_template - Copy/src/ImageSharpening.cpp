#include "ImageSharpening.h"

// Default constructor
ImageSharpening::ImageSharpening() {

}

ImageSharpening::~ImageSharpening(){

}

ImageMatrix ImageSharpening::sharpen(const ImageMatrix& input_image, double k) 
{
	double** CustomKernel = new double* [3]
	{
		new double[3] {1.0 / 9.0, 1.0 / 9.0, 1.0 / 9.0},
		new double[3] {1.0 / 9.0, 1.0 / 9.0, 1.0 / 9.0},
		new double[3] {1.0 / 9.0, 1.0 / 9.0, 1.0 / 9.0}
	};
	Convolution Conv(CustomKernel, 3, 3, 1, true);
	ImageMatrix BlurredImage = Conv.convolve(input_image);
	ImageMatrix SharpenedImage = input_image + (input_image - BlurredImage) * k;
	SharpenedImage.Clip();

	for (int i = 0; i < 3; i++)
		delete[] * (CustomKernel + i);
		
	delete[] CustomKernel;

	return SharpenedImage;

}
