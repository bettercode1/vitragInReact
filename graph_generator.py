#!/usr/bin/env python3
"""
Matplotlib Graph Generator for Cube Testing
This file generates professional graphs for cube testing results using Matplotlib
"""

import sys
import os
import json
import tempfile
import base64
from datetime import datetime
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from matplotlib.patches import Rectangle
import numpy as np

# Set matplotlib to use a non-interactive backend
import matplotlib
matplotlib.use('Agg')

class GraphGenerator:
    """Generate professional graphs for cube testing results"""
    
    def __init__(self):
        # Set up professional styling
        plt.style.use('default')
        self.colors = {
            'primary': '#FFA500',  # Orange
            'secondary': '#2B3245',  # Dark blue
            'success': '#28a745',
            'warning': '#ffc107',
            'danger': '#dc3545',
            'info': '#17a2b8'
        }
        
    def generate_strength_graph(self, test_data):
        """
        Generate a compressive strength graph for cube testing
        
        Args:
            test_data: Dictionary containing test results
            
        Returns:
            str: Base64 encoded image data
        """
        try:
            # Extract data
            job_number = test_data.get('job_number', 'N/A')
            customer_name = test_data.get('customer_name', 'N/A')
            site_name = test_data.get('site_name', 'N/A')
            grade = test_data.get('grade', 'M25')
            test_results = test_data.get('test_results', [])
            
            if not test_results:
                raise ValueError("No test results provided")
            
            # Create figure with professional styling
            fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 10))
            fig.patch.set_facecolor('white')
            
            # Extract cube data
            cube_numbers = []
            strengths = []
            ages = []
            casting_date = None
            
            for result in test_results:
                cube_numbers.append(result.get('cube_number', len(cube_numbers) + 1))
                strengths.append(result.get('compressive_strength', 0))
                ages.append(result.get('age_in_days', 28))
                if not casting_date:
                    casting_date = result.get('casting_date', 'N/A')
            
            # Calculate average strength
            avg_strength = np.mean(strengths)
            
            # Graph 1: Individual Cube Strengths
            bars = ax1.bar(cube_numbers, strengths, color=self.colors['primary'], 
                          alpha=0.8, edgecolor='white', linewidth=2)
            
            # Add average line
            ax1.axhline(y=avg_strength, color=self.colors['danger'], 
                       linestyle='--', linewidth=2, label=f'Average: {avg_strength:.1f} N/mm²')
            
            # Add value labels on bars
            for bar, strength in zip(bars, strengths):
                height = bar.get_height()
                ax1.text(bar.get_x() + bar.get_width()/2., height + 0.5,
                        f'{strength:.1f}', ha='center', va='bottom', fontweight='bold')
            
            ax1.set_xlabel('Cube Number', fontsize=12, fontweight='bold')
            ax1.set_ylabel('Compressive Strength (N/mm²)', fontsize=12, fontweight='bold')
            ax1.set_title(f'Individual Cube Compressive Strength Results', 
                         fontsize=14, fontweight='bold', pad=20)
            ax1.legend()
            ax1.grid(True, alpha=0.3)
            ax1.set_ylim(0, max(strengths) * 1.2)
            
            # Graph 2: Strength vs Age (if multiple ages)
            if len(set(ages)) > 1:
                ax2.scatter(ages, strengths, color=self.colors['info'], s=100, alpha=0.7)
                ax2.plot(ages, strengths, color=self.colors['info'], linewidth=2, alpha=0.5)
                ax2.set_xlabel('Age (Days)', fontsize=12, fontweight='bold')
                ax2.set_ylabel('Compressive Strength (N/mm²)', fontsize=12, fontweight='bold')
                ax2.set_title('Strength Development Over Time', fontsize=14, fontweight='bold', pad=20)
                ax2.grid(True, alpha=0.3)
            else:
                # If same age, show strength distribution
                ax2.hist(strengths, bins=min(len(strengths), 5), color=self.colors['success'], 
                        alpha=0.7, edgecolor='white', linewidth=2)
                ax2.axvline(x=avg_strength, color=self.colors['danger'], 
                           linestyle='--', linewidth=2, label=f'Average: {avg_strength:.1f} N/mm²')
                ax2.set_xlabel('Compressive Strength (N/mm²)', fontsize=12, fontweight='bold')
                ax2.set_ylabel('Frequency', fontsize=12, fontweight='bold')
                ax2.set_title('Strength Distribution', fontsize=14, fontweight='bold', pad=20)
                ax2.legend()
                ax2.grid(True, alpha=0.3)
            
            # Add main title with test information
            fig.suptitle(f'Cube Testing Results - {job_number}\n{customer_name} - {site_name}', 
                        fontsize=16, fontweight='bold', y=0.98)
            
            # Add footer with test details
            footer_text = f'Grade: {grade} | Casting Date: {casting_date} | Test Method: IS 516 (Part 1/Sec 1):2021'
            fig.text(0.5, 0.02, footer_text, ha='center', fontsize=10, style='italic')
            
            # Add Vitrag Associates branding
            fig.text(0.02, 0.02, 'Vitrag Associates LLP', ha='left', fontsize=10, 
                    fontweight='bold', color=self.colors['primary'])
            
            plt.tight_layout()
            plt.subplots_adjust(top=0.92, bottom=0.1)
            
            # Save to temporary file
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.png')
            plt.savefig(temp_file.name, dpi=300, bbox_inches='tight', 
                       facecolor='white', edgecolor='none')
            plt.close()
            
            # Convert to base64
            with open(temp_file.name, 'rb') as f:
                image_data = base64.b64encode(f.read()).decode('utf-8')
            
            # Clean up
            os.unlink(temp_file.name)
            
            return image_data
            
        except Exception as e:
            print(f"Error generating strength graph: {e}")
            raise e
    
    def generate_trend_graph(self, historical_data):
        """
        Generate a trend graph for multiple test results over time
        
        Args:
            historical_data: List of test results over time
            
        Returns:
            str: Base64 encoded image data
        """
        try:
            # Create figure
            fig, ax = plt.subplots(figsize=(12, 8))
            fig.patch.set_facecolor('white')
            
            # Extract data
            dates = []
            avg_strengths = []
            job_numbers = []
            
            for data in historical_data:
                dates.append(datetime.strptime(data.get('test_date', '01/01/2024'), '%d/%m/%Y'))
                test_results = data.get('test_results', [])
                if test_results:
                    strengths = [r.get('compressive_strength', 0) for r in test_results]
                    avg_strengths.append(np.mean(strengths))
                else:
                    avg_strengths.append(0)
                job_numbers.append(data.get('job_number', 'N/A'))
            
            # Plot trend line
            ax.plot(dates, avg_strengths, marker='o', linewidth=3, markersize=8,
                   color=self.colors['primary'], markerfacecolor=self.colors['info'])
            
            # Add job number labels
            for i, (date, strength, job) in enumerate(zip(dates, avg_strengths, job_numbers)):
                ax.annotate(job, (date, strength), textcoords="offset points", 
                           xytext=(0,10), ha='center', fontsize=8)
            
            # Formatting
            ax.set_xlabel('Test Date', fontsize=12, fontweight='bold')
            ax.set_ylabel('Average Compressive Strength (N/mm²)', fontsize=12, fontweight='bold')
            ax.set_title('Compressive Strength Trend Over Time', fontsize=14, fontweight='bold', pad=20)
            ax.grid(True, alpha=0.3)
            
            # Format x-axis dates
            ax.xaxis.set_major_formatter(mdates.DateFormatter('%d/%m/%Y'))
            ax.xaxis.set_major_locator(mdates.DayLocator(interval=7))
            plt.setp(ax.xaxis.get_majorticklabels(), rotation=45)
            
            plt.tight_layout()
            
            # Save to temporary file
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.png')
            plt.savefig(temp_file.name, dpi=300, bbox_inches='tight', 
                       facecolor='white', edgecolor='none')
            plt.close()
            
            # Convert to base64
            with open(temp_file.name, 'rb') as f:
                image_data = base64.b64encode(f.read()).decode('utf-8')
            
            # Clean up
            os.unlink(temp_file.name)
            
            return image_data
            
        except Exception as e:
            print(f"Error generating trend graph: {e}")
            raise e

def generate_graph_from_react_data(react_data, graph_type='strength'):
    """
    Generate graph from React frontend data
    
    Args:
        react_data: Dictionary containing test data
        graph_type: Type of graph to generate ('strength' or 'trend')
        
    Returns:
        str: Base64 encoded image data
    """
    try:
        generator = GraphGenerator()
        
        if graph_type == 'strength':
            return generator.generate_strength_graph(react_data)
        elif graph_type == 'trend':
            return generator.generate_trend_graph(react_data.get('historical_data', []))
        else:
            raise ValueError(f"Unknown graph type: {graph_type}")
            
    except Exception as e:
        print(f"Error generating graph: {e}")
        raise e

def main():
    """Main function to handle command line usage"""
    if len(sys.argv) < 3:
        print("Usage: python graph_generator.py <graph_type> <json_data>")
        print("Graph types: strength, trend")
        sys.exit(1)
    
    try:
        graph_type = sys.argv[1]
        json_data = sys.argv[2]
        react_data = json.loads(json_data)
        
        # Generate graph
        image_data = generate_graph_from_react_data(react_data, graph_type)
        
        # Return the base64 image data
        print(image_data)
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
