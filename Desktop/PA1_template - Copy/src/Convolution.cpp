#include <iostream>

#include "Convolution.h"

// Default constructor 
Convolution::Convolution() {
}

// Parametrized constructor for custom kernel and other parameters
Convolution::Convolution(double** customKernel, int kh, int kw, int stride_val, bool pad)
	:CurrentKernelHeight{kh}, CurrentKernelWidth{kw}, CurrentStrideValue{stride_val}, CurrentPaddle{pad}
{
	CurrentKernel = new double* [CurrentKernelHeight];
	for (int i = 0; i < CurrentKernelHeight; i++)
	{
		*(CurrentKernel + i) = new double [CurrentKernelWidth];
		for (int k = 0; k < CurrentKernelWidth; k++)
			*(*(CurrentKernel + i) + k) = *(*(customKernel + i) + k);
	}
}

// Destructor
Convolution::~Convolution() 
{
	for (int i = 0; i < CurrentKernelHeight; i++)
		delete[] * (CurrentKernel + i);
	
	delete[] CurrentKernel;
}

// Copy constructor
Convolution::Convolution(const Convolution &other)
	:Convolution(other.CurrentKernel, other.CurrentKernelHeight, other.CurrentKernelWidth, other.CurrentStrideValue, other.CurrentPaddle)
{



}

// Copy assignment operator
Convolution& Convolution::operator=(const Convolution &other) 
{
	if (this == &other)
		return *this;

	if (CurrentKernel != nullptr)
	{
		for (int i = 0; i < CurrentKernelHeight; i++)
			delete[] * (CurrentKernel + i);

		delete[] CurrentKernel;
	}
	CurrentKernel = new double* [CurrentKernelHeight];
	for (int i = 0; i < CurrentKernelHeight; i++)
	{
		*(CurrentKernel + i) = new double [CurrentKernelWidth];
		for (int k = 0; k < CurrentKernelWidth; k++)
			*(*(CurrentKernel + i) + k) = *(*(other.CurrentKernel + i) + k);
	}

	CurrentKernelHeight = other.CurrentKernelHeight;
	CurrentKernelWidth = other.CurrentKernelWidth;
	CurrentPaddle = other.CurrentPaddle;
	CurrentStrideValue = other.CurrentStrideValue;
	return *this;
}


// Convolve Function: Responsible for convolving the input image with a kernel and return the convolved image.
ImageMatrix Convolution::convolve(const ImageMatrix& input_image) const 
{
	if (!CurrentKernel) return input_image;
	ImageMatrix NewImage;
	if (CurrentPaddle == true)
	{

		double** NewData = new double* [input_image.GetHeight() + 2];
		for (int i = 0; i < input_image.GetHeight() + 2; i++)
		{
			*(NewData + i) = new double [input_image.GetWidth() + 2];
			for (int k = 0; k < input_image.GetWidth() + 2; k++)
			{
				if (i == 0 || i == input_image.GetHeight() + 1 || k == 0 || k == input_image.GetWidth() + 1)
					*(*(NewData + i) + k) = 0.0;
				else
					*(*(NewData + i) + k) = *(*(input_image.get_data() + i - 1) + k - 1);
				
			}
			
		}
		NewImage = ImageMatrix(NewData, input_image.GetHeight() + 2, input_image.GetWidth() + 2);
		

		
	}
	else
	{
		NewImage = ImageMatrix(input_image.get_data(), input_image.GetHeight(), input_image.GetWidth());

	}
	bool bShouldGoLowerAndRight = true;
	if (CurrentKernelHeight % 2 == 0) bShouldGoLowerAndRight = false;
	for (int i = CurrentKernelHeight / 2; i < NewImage.GetHeight() - CurrentKernelHeight / 2; i += CurrentStrideValue)
	{
		for (int j = CurrentKernelWidth / 2; j < NewImage.GetWidth() - CurrentKernelWidth / 2; j += CurrentStrideValue)
		{
			double sum = 0.0;
			
			sum += *(*(NewImage.get_data() + i) + j) * *(*(CurrentKernel)+CurrentKernelWidth);

			for (int w = 1; w < CurrentKernelWidth / 2; w++)
			{
				sum += *(*(NewImage.get_data() + i) + j - w) * *(*(CurrentKernel + CurrentKernelHeight / 2) + CurrentKernelWidth / 2 - w);
				if (j = NewImage.GetWidth() - CurrentKernelWidth / 2 - 1)
				{
					if (bShouldGoLowerAndRight) 
						sum += *(*(NewImage.get_data() + i) + j + w) * *(*(CurrentKernel + CurrentKernelHeight / 2) + CurrentKernelWidth / 2 + w);

				}
				else sum += *(*(NewImage.get_data() + i) + j + w) * *(*(CurrentKernel + CurrentKernelHeight / 2) + CurrentKernelWidth / 2 + w);
			}

			for (int h = 1; h < CurrentKernelHeight / 2; h++)
			{
				sum += *(*(NewImage.get_data() + i - h) + j) * *(*(CurrentKernel + CurrentKernelHeight / 2 - h) + CurrentKernelWidth / 2);
				if (j = NewImage.GetHeight() - CurrentKernelHeight / 2 - 1)
				{
					if (bShouldGoLowerAndRight) 
						sum += *(*(NewImage.get_data() + i + h) + j) * *(*(CurrentKernel + CurrentKernelHeight / 2 + h) + CurrentKernelWidth / 2);

				}
				else sum += *(*(NewImage.get_data() + i + h) + j) * *(*(CurrentKernel + CurrentKernelHeight / 2 + h) + CurrentKernelWidth / 2);

			}

			*(*(NewImage.get_data() + i) + j) = sum;
			if (CurrentStrideValue > 1 && j + CurrentStrideValue >= NewImage.GetWidth() - CurrentKernelWidth / 2)
			{
				j = j + CurrentStrideValue - NewImage.GetWidth() - CurrentKernelWidth / 2;
				i++;
			}



		}
	}
	return NewImage;
}
