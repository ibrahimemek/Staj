// EdgeDetector.cpp

#include "EdgeDetector.h"
#include <cmath>

#include "EdgeDetector.h"
#include <cmath>

// Default constructor
EdgeDetector::EdgeDetector() {

}

// Destructor
EdgeDetector::~EdgeDetector() {

}

// Detect Edges using the given algorithm
std::vector<std::pair<int, int>> EdgeDetector::detectEdges(const ImageMatrix& input_image) 
{
	double** KernelGx;
	KernelGx = new double* [3]
	{
		new double[3] {-1, 0, 1},
		new double[3] {-2, 0, 2},
		new double[3] {-1, 0, 1}
	};
	double** KernelGy;
	KernelGy = new double* [3]
	{
		new double[3] {-1, -2, -1},
		new double[3] {0, 0, 0},
		new double[3] {1, 2, 1}
	};	
	
	Convolution ConvX(KernelGx, 3, 3, 1, true);
	ImageMatrix NewImageX = ConvX.convolve(input_image);

	Convolution ConvY(KernelGy, 3, 3, 1, true);
	ImageMatrix NewImageY = ConvY.convolve(input_image);

	
	double AllGradSum = 0.0;
	double** GradientMagnitudeData = new double* [input_image.GetHeight()];
	for (int i = 0; i < input_image.GetHeight(); i++)
	{
		*(GradientMagnitudeData + i) = new double [input_image.GetWidth()];
		for (int j = 0; j < input_image.GetWidth(); j++)
		{
			 double CurrentGrand = sqrt(pow(*(*(NewImageX.get_data() + i) + j), 2) + pow(*(*(NewImageY.get_data() + i) + j), 2));
			 *(*(GradientMagnitudeData + i) + j) = CurrentGrand;
			 AllGradSum += CurrentGrand;
		}
	}
	double AverageGrad = AllGradSum / (input_image.GetHeight() * input_image.GetWidth());

	std::vector<std::pair<int, int>> Edges;
	for (int i = 0; i < input_image.GetHeight(); i++)
	{
		for (int j = 0; j < input_image.GetWidth(); j++)
		{
			// @todo what is the problem?
			if (*(*(GradientMagnitudeData + i) + j) > AverageGrad)
			{
				Edges.push_back(std::make_pair(i, j));
			}
		}
	}

	for (int i = 0; i < input_image.GetHeight(); i++)
		delete[] *(GradientMagnitudeData + i);
	// @todo what is the problem?
	delete[] GradientMagnitudeData;

	for (int i = 0; i < 3; i++)
		delete[] * (KernelGx + i);
	delete[] KernelGx;

	for (int i = 0; i < 3; i++)
		delete[] * (KernelGy + i);
	delete[] KernelGy;

	return Edges;
}

