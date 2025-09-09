
"""
This module provides an enhanced implementation of the PDF generation code with improved
responsive layout, text wrapping, image rendering, and page break handling.
"""

import os
import io
import json


import traceback
from datetime import datetime
from fpdf import FPDF
from flask import current_app as app

def add_standard_header(pdf, page_title=None, page_number=1):
    """Add EXACT same header as page 1 across all pages"""
    # Logo on the left with gray border box - exact match to reference  
    logo_x, logo_y, logo_w, logo_h = 10, 8, 40, 25
    pdf.add_image_safe(os.path.join('static', 'images', 'logo.png'), x=logo_x, y=logo_y, w=logo_w, h=logo_h)
    
    # Draw gray border around logo - exact match to reference
    pdf.set_draw_color(128, 128, 128)  # Gray border
    pdf.set_line_width(0.8)  # Medium thickness
    pdf.rect(logo_x, logo_y, logo_w, logo_h)
    
    # NABL logo on the right - ONLY on page 1
    if page_number == 1:
        nabl_x, nabl_y, nabl_w, nabl_h = 170, 8, 25, 25
        nabl_paths = [
            os.path.join('static', 'images', 'nabl_logo_final.png'),
            os.path.join('static', 'images', 'nabl.png')
        ]
        
        for nabl_path in nabl_paths:
            if pdf.add_image_safe(nabl_path, x=nabl_x, y=nabl_y, w=nabl_w, h=nabl_h):
                break
                
        # NABL certification number centered below NABL logo - only on page 1
        pdf.set_font('Times', 'B', 8)
        pdf.set_text_color(0, 0, 0)  # Black text
        tc_text = 'TC-15756'
        tc_width = pdf.get_string_width(tc_text)
        tc_x = nabl_x + (nabl_w - tc_width) / 2  # Center the text under logo
        pdf.text(tc_x, nabl_y + nabl_h + 5, tc_text)  # Increased gap from +2 to +5
            
    # Company name in red - PERFECTLY CENTERED
    pdf.set_font('Times', 'B', 22)
    pdf.set_text_color(180, 0, 0)  # Dark red color
    company_name = 'VITRAG ASSOCIATES LLP'
    company_width = pdf.get_string_width(company_name)
    company_x = (210 - company_width) / 2  # Perfect center calculation
    pdf.text(company_x, 22, company_name)  # Moved down from 20 to 22
    
    # Subtitle in blue - PERFECTLY CENTERED
    pdf.set_font('Times', 'B', 14)
    pdf.set_text_color(0, 80, 160)  # Blue color like reference
    subtitle = '(Construction Material Testing Laboratory)'
    subtitle_width = pdf.get_string_width(subtitle)
    subtitle_x = (210 - subtitle_width) / 2  # Perfect center calculation
    pdf.text(subtitle_x, 29, subtitle)  # Moved down from 27 to 29
    
    # Horizontal line below header - starts from logo rectangle bottom-right corner with horizontal gap
    pdf.set_draw_color(0, 0, 0)
    pdf.set_line_width(0.8)
    if page_number == 1:
        pdf.line(55, 33, 162, 33)  # Line starts 5mm after logo end, stops before NABL logo on page 1
    else:
        pdf.line(55, 33, 200, 33)  # Line starts 5mm after logo end, full width on pages 2 and 3 (no NABL logo)
    
    # Page-specific title if provided - exact positioning from reference
    if page_title:
        pdf.set_font('Times', 'B', 14)
        pdf.set_text_color(0, 0, 0)  # Black text like reference
        title_width = pdf.get_string_width(page_title)
        title_x = (210 - title_width) / 2  # Center the title
        pdf.text(title_x, 40, page_title)  # Moved up from 43 to 40
        
        # Underline for title - exact positioning
        pdf.set_line_width(0.8)
        pdf.line(title_x, 42, title_x + title_width, 42)  # Moved up from 45 to 42

class ResponsivePDF(FPDF):
    """Enhanced FPDF class with responsive layout capabilities"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.set_auto_page_break(auto=True, margin=15)
    
    def multi_cell_with_border(self, w, h, txt, border=0, align='L', fill=False):
        """Multi-cell with proper border handling"""
        x = self.get_x()
        y = self.get_y()
        
        # Calculate text height
        lines = self.get_string_width(txt) / w
        line_height = h
        total_height = max(h, line_height * max(1, int(lines) + 1))
        
        # Draw border if needed
        if border:
            self.rect(x, y, w, total_height)
        
        # Add text with proper wrapping
        self.multi_cell(w, line_height, txt, 0, align, fill)
        
        # Return to position after border
        self.set_xy(x + w, y)
        return total_height
    
    def responsive_cell(self, w, h, txt, border=0, ln=0, align='L', fill=False, max_font_size=10, min_font_size=6):
        """Cell that automatically adjusts font size to fit content"""
        original_font_size = self.font_size_pt
        font_size = max_font_size
        
        # Test if text fits at current font size
        while font_size >= min_font_size:
            self.set_font_size(font_size)
            text_width = self.get_string_width(txt)
            
            if text_width <= (w - 4):  # 2mm padding on each side
                break
            font_size -= 0.5
        
        # Draw the cell
        self.cell(w, h, txt, border, ln, align, fill)
        
        # Restore original font size
        self.set_font_size(original_font_size)
        return font_size
    
    def add_image_safe(self, image_path, x, y, w, h=None):
        """Safely add image with error handling and proper scaling"""
        try:
            if os.path.exists(image_path):
                # Ensure height is set if not provided
                if h is None:
                    h = w * 0.7
                
                # Add image with proper scaling
                self.image(image_path, x=x, y=y, w=w, h=h)
                return True
            else:
                app.logger.warning(f"Image file not found: {image_path}")
                return False
        except Exception as e:
            app.logger.error(f"Error loading image {image_path}: {e}")
            return False
    
    def check_page_break(self, height_needed):
        """Check if we need a page break for the given height"""
        if self.get_y() + height_needed > self.page_break_trigger:
            self.add_page()
            return True
        return False

def generate_exact_format_pdf(pdf_path, test_request, customer, main_test, test_results=None, reviewer_info=None):
    """
    Generate a PDF file with enhanced responsive layout and proper formatting
    
    Args:
        pdf_path: Path where to save the generated PDF
        test_request: TestRequest object
        customer: Customer object
        main_test: ConcreteTest object
        test_results: List of test result dictionaries (optional)
        reviewer_info: Dictionary containing reviewer name, designation, and graduation (optional)
        
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        # Format dates for display
        receipt_date = test_request.receipt_date.strftime('%d/%m/%Y') if test_request.receipt_date else 'N/A'
        casting_date = main_test.casting_date.strftime('%d/%m/%Y') if main_test.casting_date else 'N/A'
        testing_date = main_test.testing_date.strftime('%d/%m/%Y') if main_test.testing_date else 'N/A'
        report_date = datetime.now().strftime('%d/%m/%Y')
        
        # Calculate the age in days
        age_in_days = main_test.age_in_days or 'N/A'
        
        # Parse test results JSON if not provided
        if test_results is None:
            test_results = []
            if main_test.test_results_json:
                try:
                    parsed_data = json.loads(main_test.test_results_json)
                    app.logger.debug(f"PDF Generation - Raw JSON: {main_test.test_results_json}")
                    app.logger.debug(f"PDF Generation - Parsed data: {parsed_data}")
                    
                    # Make sure test_results is a list of dictionaries
                    if isinstance(parsed_data, list):
                        # Filter out strength_data objects and keep only test result objects
                        test_results = [result for result in parsed_data if isinstance(result, dict) and ('cube_id' in result or 'dimension_length' in result or 'dimension_height' in result)]
                        app.logger.debug(f"PDF Generation - Filtered test results: {test_results}")
                    elif isinstance(parsed_data, dict):
                        # If it's a single dictionary, wrap it in a list
                        if 'strength_data' in parsed_data:
                            # Skip strength data objects
                            pass
                        else:
                            # Regular case - use the dict as a single result
                            test_results = [parsed_data]
                            app.logger.debug(f"PDF Generation - Single test result: {test_results}")
                except Exception as e:
                    app.logger.error(f"Error parsing test_results_json: {e}")
                    
        # Use actual database values - never use placeholder data
        if not test_results and main_test.test_results_json:
            try:
                parsed_data = json.loads(main_test.test_results_json)
                if isinstance(parsed_data, list):
                    test_results = parsed_data
                elif isinstance(parsed_data, dict) and 'strength_data' not in parsed_data:
                    test_results = [parsed_data]
            except Exception as e:
                app.logger.error(f"Error parsing test_results_json: {e}")
        
        # If no test results from JSON, build from database fields
        if not test_results:
            # Check for any observation data in database
            has_observations = (main_test.dimension_length or main_test.dimension_width or 
                              main_test.dimension_height or main_test.weight or 
                              main_test.crushing_load or main_test.compressive_strength)
            
            if has_observations:
                # Build test results for each cube from available data
                cube_count = int(main_test.num_of_cubes or 1)
                test_results = []
                
                for i in range(cube_count):
                    cube_result = {
                        'cube_id': i + 1,
                        'id_mark': main_test.id_mark or '',
                        'dimension_length': main_test.dimension_length or '',
                        'dimension_width': main_test.dimension_width or '', 
                        'dimension_height': main_test.dimension_height or '',
                        'weight': main_test.weight or '',
                        'crushing_load': main_test.crushing_load or '',
                        'compressive_strength': main_test.compressive_strength or '',
                        'failure_type': main_test.failure_type or '',
                        'area': ''
                    }
                    
                    # Calculate area if dimensions are available
                    if (main_test.dimension_length and main_test.dimension_width and 
                        main_test.dimension_length > 0 and main_test.dimension_width > 0):
                        area = main_test.dimension_length * main_test.dimension_width
                        cube_result['area'] = area
                    
                    test_results.append(cube_result)
                
                app.logger.debug(f"PDF Generation - Built {len(test_results)} cube results from database fields")
                app.logger.debug(f"PDF Generation - Database fallback test_results: {test_results}")
            else:
                # No observation data available
                test_results = [{
                    'id_mark': main_test.id_mark or 'Pending',
                    'dimension_length': 'Pending Observation',
                    'dimension_width': 'Pending Observation', 
                    'dimension_height': 'Pending Observation',
                    'weight': 'Pending Observation',
                    'crushing_load': 'Pending Observation',
                    'compressive_strength': 'Pending Observation',
                    'failure_type': 'Pending Observation',
                    'area': 'Pending Observation'
                }]
                
            app.logger.debug(f"PDF Generation - Final test_results being used: {test_results}")
            app.logger.debug(f"PDF Generation - Number of test results: {len(test_results) if test_results else 0}")
            
        # Create the PDF file with enhanced class
        pdf = ResponsivePDF('P', 'mm', 'A4')
        pdf.set_margins(left=10, top=10, right=10)
        pdf.add_page()
        
        # Set thin line width for all table borders
        pdf.set_line_width(0.2)  # Make all table borders thinner
        
        # All fonts are now handled by FPDF's built-in Times font
            
        # White background for the entire document
        pdf.set_fill_color(255, 255, 255)
        
        # Add standard header with TEST REPORT title
        add_standard_header(pdf, 'TEST REPORT', page_number=1)
        
        # Set thin line width for all table borders throughout the document
        pdf.set_line_width(0.2)
        
        # Header and title already handled by add_standard_header function above
        
        # Define responsive table properties - increased for better consistency
        page_width = 190  # Usable page width
        col_width1 = page_width * 0.24  # 24% for header column (left tables)
        col_width2 = page_width * 0.26  # 26% for value column (left tables)
        col_width3 = page_width * 0.24  # 24% for header column (right tables)
        col_width4 = page_width * 0.26  # 26% for value column (right tables)
        row_height = 4  # Reduced from 6 to 4 for more compact spacing
        
        # Left tables (first column) - reduced spacing after header
        x_start1 = 10
        y_start = 44  # Reduced from 47 to 44 to move table closer to title
        
        # Right tables (second column)
        x_start2 = x_start1 + col_width1 + col_width2
        
        # Check page break before starting tables
        pdf.check_page_break(row_height * 12)  # Estimate height needed
        
        # Helper function for table rows with responsive text
        def add_table_row(label, value, is_split=True):
            nonlocal y_start
            pdf.set_xy(x_start1, y_start)
            pdf.set_font('Times', '', 11)  # Changed to unbold
            
            if is_split:
                # Left side
                pdf.responsive_cell(col_width1, row_height, label, 1, 0, 'L', True)
                pdf.set_font('Times', '', 11)  # Keep unbold
                pdf.responsive_cell(col_width2, row_height, str(value)[:30], 1, 0, 'L')
            else:
                # Full width
                pdf.responsive_cell(col_width1, row_height, label, 1, 0, 'L', True)
                pdf.set_font('Times', '', 11)  # Keep unbold
                pdf.responsive_cell(col_width2 + col_width3 + col_width4, row_height, str(value)[:60], 1, 1, 'L')
                y_start += row_height
                return
            
            y_start += row_height
        
        def add_table_row_pair(left_label, left_value, right_label, right_value):
            nonlocal y_start
            pdf.set_xy(x_start1, y_start)
            pdf.set_font('Times', '', 11)  # Changed to unbold
            
            # Left side
            pdf.responsive_cell(col_width1, row_height, left_label, 1, 0, 'L', True)
            pdf.set_font('Times', '', 11)  # Keep unbold
            
            # Check if left value needs highlighting
            left_value_str = str(left_value)[:25]
            # Highlight Date of Casting regardless of the specific date value
            if left_label == 'Date of Casting':
                # Add yellow highlight for Date of Casting
                text_width = pdf.get_string_width(left_value_str)
                cell_x = pdf.get_x()
                cell_y = pdf.get_y()
                
                # Calculate highlight position to stay within cell boundaries
                highlight_x = cell_x + 1  # Minimal padding from cell edge
                highlight_y = cell_y + 0.5   # Better vertical alignment - moved up by 0.5mm
                highlight_width = text_width + 2  # Slightly wider for better visibility
                highlight_height = 4  # Increased height by 1mm for better visibility
                
                pdf.set_fill_color(255, 255, 0)  # Yellow background
                pdf.rect(highlight_x, highlight_y, highlight_width, highlight_height, 'F')  # Highlight rectangle
                pdf.set_fill_color(255, 255, 255)  # Reset to white background
                pdf.responsive_cell(col_width2, row_height, left_value_str, 1, 0, 'L')
            else:
                pdf.responsive_cell(col_width2, row_height, left_value_str, 1, 0, 'L')
            
            # Right side
            pdf.set_xy(x_start2, y_start)
            pdf.set_font('Times', '', 11)  # Changed to unbold
            pdf.responsive_cell(col_width3, row_height, right_label, 1, 0, 'L', True)
            pdf.set_font('Times', '', 11)  # Keep unbold
            
            # Check if right value needs highlighting
            right_value_str = str(right_value)[:25]
            # Special handling for Age of Specimen - split number and "Days"
            if right_label == 'Age of Specimen' and "Days" in right_value_str:
                # Split the value into number and "Days"
                number_part = right_value_str.replace(" Days", "").replace(" Days", "")
                days_part = "Days"
                
                # Calculate positions for split cell
                cell_x = pdf.get_x()
                cell_y = pdf.get_y()
                half_width = col_width4 / 2
                
                # Draw vertical separator line in the center
                separator_x = cell_x + half_width
                pdf.line(separator_x, cell_y, separator_x, cell_y + row_height)
                
                # Left half - Number with highlight
                pdf.set_xy(cell_x, cell_y)
                pdf.cell(half_width, row_height, '', 1, 0, 'L')  # Draw left border
                
                # Add yellow highlight for the number only
                number_width = pdf.get_string_width(number_part)
                highlight_x = cell_x + 1
                highlight_y = cell_y + 0.5
                highlight_width = number_width + 2
                highlight_height = 4
                
                pdf.set_fill_color(255, 255, 0)  # Yellow background
                pdf.rect(highlight_x, highlight_y, highlight_width, highlight_height, 'F')
                pdf.set_fill_color(255, 255, 255)  # Reset to white background
                
                # Draw the number
                pdf.set_xy(cell_x, cell_y)
                pdf.cell(half_width, row_height, number_part, 0, 0, 'L')
                
                # Right half - "Days" without highlight
                pdf.set_xy(cell_x + half_width, cell_y)
                pdf.cell(half_width, row_height, days_part, 1, 1, 'L')
                
            elif right_label == 'Grade of Specimen':
                # Add yellow highlight for Grade of Specimen
                text_width = pdf.get_string_width(right_value_str)
                cell_x = pdf.get_x()
                cell_y = pdf.get_y()
                
                # Calculate highlight position to stay within cell boundaries
                highlight_x = cell_x + 1  # Minimal padding from cell edge
                highlight_y = cell_y + 0.5   # Better vertical alignment - moved up by 0.5mm
                highlight_width = text_width + 2  # Slightly wider for better visibility
                highlight_height = 4  # Increased height by 1mm for better visibility
                
                pdf.set_fill_color(255, 255, 0)  # Yellow background
                pdf.rect(highlight_x, highlight_y, highlight_width, highlight_height, 'F')  # Highlight rectangle
                pdf.set_fill_color(255, 255, 255)  # Reset to white background
                pdf.responsive_cell(col_width4, row_height, right_value_str, 1, 1, 'L')
            else:
                pdf.responsive_cell(col_width4, row_height, right_value_str, 1, 1, 'L')
            
            y_start += row_height
        
        # Use actual customer name from database
        customer_name = customer.name if customer and customer.name else test_request.customer_name or "N/A"
        
        # Use actual address from database
        address_text = customer.address if customer and customer.address else test_request.site_name or "N/A"
        
        # Use actual data for all fields - rearranged as requested
        # Special handling for merged customer name and address cell with auto font sizing
        pdf.set_xy(x_start1, y_start)
        pdf.set_font('Times', '', 11)
        
        # Left side - merged cell for Customer/Site Name & Address (15mm height)
        pdf.set_xy(x_start1, y_start)
        pdf.cell(col_width1, 15, '', 1, 0, 'L', True)  # Draw empty cell with border
        
        # Add label text starting from top-left corner
        pdf.set_xy(x_start1 + 1, y_start + 1)  # 1mm padding from top-left
        pdf.multi_cell(col_width1 - 2, 6, 'Customer/Site Name &\nAddress', 0, 'L', False)
        
        # Right side - Date of Report (single height)
        pdf.set_xy(x_start2, y_start)
        pdf.cell(col_width3, row_height, 'Date of Report', 1, 0, 'L', True)
        pdf.cell(col_width4, row_height, report_date, 1, 1, 'L')
        
        # Right side - ULR Number (extended height to match customer column)
        pdf.set_xy(x_start2, y_start + row_height)
        pdf.cell(col_width3, 15 - row_height, 'ULR Number', 1, 0, 'L', True)
        pdf.cell(col_width4, 15 - row_height, test_request.ulr_number or "N/A", 1, 1, 'L')
        
        # Customer name and address with auto font sizing - in the value column
        pdf.set_xy(x_start1 + col_width1, y_start)
        pdf.cell(col_width2, 15, '', 1, 0, 'L', False)  # Draw empty cell with border
        
        # Add value text starting from top-left corner - combine name and address with comma
        combined_text = f'{customer_name}, {address_text}'
        
        # Auto-adjust font size to fit the text in the available space - allow wrapping to 2-3 lines
        original_font_size = 11
        font_size = original_font_size
        cell_width = col_width2 - 2  # Account for padding
        
        # Test if text fits at current font size, reduce if needed - but keep minimum at 9pt
        while font_size >= 9:  # Keep minimum at 9pt for readability
            pdf.set_font('Times', '', font_size)
            # Check if the longest line fits within the cell width
            longest_line = max(len(customer_name), len(address_text))
            if longest_line * (font_size * 0.35) <= (cell_width - 4):  # Rough character width estimation
                break
            font_size -= 0.5
        
        # Draw the value text starting from top-left corner - allow multiple lines
        pdf.set_xy(x_start1 + col_width1 + 1, y_start + 1)  # Start from top-left with 1mm padding
        pdf.multi_cell(cell_width, 5, combined_text, 0, 'L', False)  # 5mm line height for better spacing
        
        y_start += 15  # Move down by 15mm height
        add_table_row_pair('Reference Number', main_test.sample_code_number or "N/A", 'Job Code Number', test_request.job_number or "N/A")
        
        # Location/Structure Type - full width
        add_table_row('Location/Structure Type', main_test.location_nature or "N/A", False)
        
        add_table_row_pair('Date of Receipt', receipt_date, 'Age of Specimen', f"{int(age_in_days)} Days" if age_in_days != 'N/A' else 'N/A')
        add_table_row_pair('Date of Casting', casting_date, 'Date of Testing', testing_date)
        
        # Test type determination
        specimen_type = "Concrete Cube" if test_request.test_type == 'CC' else "Material Test" if test_request.test_type == 'MT' else "NDT"
        add_table_row_pair('Type of Specimen', specimen_type, 'Grade of Specimen', main_test.grade or "N/A")
        
        add_table_row_pair('Condition of Specimen', main_test.cube_condition or "Acceptable", 'Curing Condition', main_test.curing_condition or "")
        
        # Machine and calibration
        machine_text = main_test.machine_used or "CTM (2000KN)"
        test_method_text = main_test.test_method or "IS 516 (Part 1/Sec 1):2021"
        # Get calibration date from database
        # Static calibration date
        calibration_date = '01/07/2026'
        # Machine used for Testing - full width
        add_table_row('Machine used for Testing', machine_text, False)
        
        add_table_row_pair('Capacity Range', "2000KN", 'Calibration Due Date', calibration_date)
        
        add_table_row_pair('Test Method', test_method_text, 'Environmental condition', "Not Applicable")
        
        # Add space between sections
        y_start += 4
        
        # Check page break before test sample description
        pdf.check_page_break(50)
        
        # DESCRIPTION OF TEST SAMPLE section with grade information
        app.logger.info(f"=== USING NEW PDF FORMAT - Grade: {main_test.grade} ===")
        
        # Get grade from database
        grade_text = main_test.grade or "N/A"
        
        # Calculate column widths for perfect header alignment
        sr_width = 12                    # Fixed width: 12mm
        id_width = 36.2                  # Fixed width: 36.2mm
        # Remaining space distributed among 4 columns for perfect alignment
        dim_width = 54.3                 # Fixed width: 54.3mm
        area_width = page_width * 0.12   # 12%
        weight_width = page_width * 0.12 # 12%
        load_width = page_width * 0.22   # 22% (increased to fill remaining space)
        
        # First row: Grade (left column) and Description (right column)
        pdf.set_xy(10, y_start)
        pdf.set_font('Times', 'B', 9)  # Reduced font size from 11 to 9 to prevent overflow
        
        # Left column: GRADE OF CONCRETE (covers Sr. No. + ID Mark columns) - increased height for 2 lines
        grade_col_width = sr_width + id_width
        pdf.cell(grade_col_width, 12, f'GRADE OF CONCRETE: {grade_text}', 1, 0, 'C')
        
        # Add yellow highlight just for the text area
        text_content = f'GRADE OF CONCRETE: {grade_text}'
        text_width = pdf.get_string_width(text_content)
        cell_center_x = 10 + grade_col_width / 2  # Center of the cell
        text_start_x = cell_center_x - text_width / 2  # Start position of text
        
        # Draw yellow highlight rectangle just around the text
        pdf.set_fill_color(255, 255, 0)  # Yellow background
        pdf.rect(text_start_x - 1, y_start + 3, text_width + 2, 6, 'F')  # Reduced height and width of highlight
        pdf.set_fill_color(255, 255, 255)  # Reset to white background
        
        # Redraw the text over the highlight
        pdf.set_xy(10, y_start)
        pdf.cell(grade_col_width, 12, text_content, 0, 0, 'C')  # Redraw text without border
        
        # Right column: DESCRIPTION OF TEST SAMPLE (covers remaining columns) - increased height for 2 lines
        desc_col_width = page_width - grade_col_width
        pdf.cell(desc_col_width, 12, 'DESCRIPTION OF TEST SAMPLE', 1, 1, 'C')
        
        # Reset font size for table headers
        pdf.set_font('Times', 'B', 10)  # Increased from 9 to 10
        
        # Responsive table headers for test sample description - adjusted for increased header height
        y_start += 12  # Increased from 6 to 12 to account for taller header row
        pdf.set_xy(10, y_start)
        pdf.set_font('Times', 'B', 10)  # Increased from 9 to 10
        
        # Use the same column widths as defined above for perfect alignment
        # sr_width, id_width, dim_width, area_width, weight_width, load_width already defined
        
        # Table header row
        pdf.responsive_cell(sr_width, row_height, 'Sr. No.', 1, 0, 'C', True, 10, 8)  # Increased font sizes
        pdf.responsive_cell(id_width, row_height, 'ID Mark', 1, 0, 'C', True, 10, 8)  # Increased font sizes
        
        # Create a header that spans the dimensions columns
        header_text = 'Dimensions (mm) (L x B x H)'
        pdf.responsive_cell(dim_width, row_height, header_text, 1, 0, 'C', True, 10, 8)  # Increased font sizes
        
        pdf.responsive_cell(area_width, row_height, 'Area (mm²)', 1, 0, 'C', True, 10, 8)  # Increased font sizes
        pdf.responsive_cell(weight_width, row_height, 'Weight (kg)', 1, 0, 'C', True, 10, 8)  # Increased font sizes
        pdf.responsive_cell(load_width, row_height, 'Max Load (kN)', 1, 1, 'C', True, 10, 8)  # Increased font sizes
        
        # Data rows for sample description - use actual database values
        pdf.set_font('Times', '', 10)  # Increased from 9 to 10
        
        # Process test results with improved data handling - ensure all cubes are shown
        dimensions = []
        cube_count = int(main_test.num_of_cubes or 1)
        
        # Helper function for safe value conversion
        def safe_float_convert(value):
            if isinstance(value, str) and not value.replace('.', '').replace('-', '').isdigit():
                return value  # Return text as-is (e.g., "Pending Observation")
            try:
                return float(value) if value else 0
            except (ValueError, TypeError):
                return value if value else 0
        
        # Helper function for formatting values
        def format_value(value, decimal_places=1):
            if isinstance(value, str):
                return value[:10]  # Truncate long text
            elif isinstance(value, (int, float)) and value > 0:
                return f"{value:.{decimal_places}f}"
            else:
                return "N/A"
        
        if test_results and len(test_results) > 0:
            app.logger.debug(f"PDF Generation - Processing {len(test_results)} test results")
            # Use all available test results up to cube_count
            for i in range(cube_count):
                if i < len(test_results):
                    result = test_results[i]
                    app.logger.debug(f"PDF Generation - Processing result {i+1}: {result}")
                    
                    length = safe_float_convert(result.get('dimension_length'))
                    width = safe_float_convert(result.get('dimension_width'))
                    height = safe_float_convert(result.get('dimension_height'))
                    weight = safe_float_convert(result.get('weight'))
                    crushing_load = safe_float_convert(result.get('crushing_load'))
                    
                    # Use pre-calculated area if available, otherwise calculate
                    area = result.get('area', 0)
                    if not area and isinstance(length, (int, float)) and isinstance(width, (int, float)) and length and width:
                        area = length * width
                    elif isinstance(area, str):
                        area = area  # Keep text values as-is
                    
                    app.logger.debug(f"  Extracted values: L={length}, W={width}, H={height}, Weight={weight}, Load={crushing_load}, Area={area}")
                    
                    # Use the actual cube_id from the data, or fallback to a generated ID
                    cube_display_id = str(result.get('cube_id', f"Cube {i+1}"))
                    
                    row = [
                        str(i + 1),
                        cube_display_id[:8],  # Display the actual cube ID from observations
                        format_value(length, 1),
                        format_value(width, 1),
                        format_value(height, 1),
                        format_value(area, 2),  # Show area with 2 decimal places
                        format_value(weight, 1),
                        format_value(crushing_load, 1)
                    ]
                    dimensions.append(row)
                    app.logger.debug(f"  Generated row: {row}")
                else:
                    # Create placeholder row for missing cube data
                    row = [
                        str(i + 1),
                        str(main_test.id_mark or "N/A")[:8],
                        "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A"
                    ]
                    dimensions.append(row)
        else:
            # No test results available - create rows using database values
            app.logger.debug(f"PDF Generation - Using database fields: {[{'id_mark': main_test.id_mark, 'dimension_length': main_test.dimension_length, 'dimension_width': main_test.dimension_width, 'dimension_height': main_test.dimension_height, 'weight': main_test.weight, 'crushing_load': main_test.crushing_load, 'compressive_strength': main_test.compressive_strength, 'average_strength': main_test.average_strength, 'failure_type': main_test.failure_type, 'area': (main_test.dimension_length * main_test.dimension_width) if main_test.dimension_length and main_test.dimension_width else ''}]}")
            
            for i in range(cube_count):
                # Calculate area from database values
                area = 0
                if main_test.dimension_length and main_test.dimension_width:
                    # Area in mm²
                    area = main_test.dimension_length * main_test.dimension_width
                
                row = [
                    str(i + 1),
                    str(main_test.id_mark or "N/A")[:8],
                    format_value(main_test.dimension_length, 1),
                    format_value(main_test.dimension_width, 1),
                    format_value(main_test.dimension_height, 1),
                    format_value(area, 2),  # Show area with 2 decimal places
                    format_value(main_test.weight, 1),
                    format_value(main_test.crushing_load, 1)
                ]
                dimensions.append(row)
            
            app.logger.debug(f"PDF Generation - Processing {len(dimensions)} test results")
            app.logger.debug(f"PDF Generation - Processing result 1: {dimensions[0] if dimensions else 'None'}")
        
        # Render dimension data rows with responsive cells
        for row in dimensions:
            y_start += row_height
            pdf.set_xy(10, y_start)
            
            pdf.responsive_cell(sr_width, row_height, row[0], 1, 0, 'C', False, 10, 8)  # Increased font sizes
            pdf.responsive_cell(id_width, row_height, row[1], 1, 0, 'C', False, 10, 8)  # Increased font sizes
            
            # Split dimensions into three equal columns
            dim_col_width = dim_width / 3
            pdf.responsive_cell(dim_col_width, row_height, row[2], 1, 0, 'C', False, 10, 8)  # Increased font sizes
            pdf.responsive_cell(dim_col_width, row_height, row[3], 1, 0, 'C', False, 10, 8)  # Increased font sizes
            pdf.responsive_cell(dim_col_width, row_height, row[4], 1, 0, 'C', False, 10, 8)  # Increased font sizes
            
            pdf.responsive_cell(area_width, row_height, row[5], 1, 0, 'C', False, 10, 8)  # Increased font sizes
            pdf.responsive_cell(weight_width, row_height, row[6], 1, 0, 'C', False, 10, 8)  # Increased font sizes
            pdf.responsive_cell(load_width, row_height, row[7], 1, 1, 'C', False, 10, 8)  # Increased font sizes
        
        # Add space before test result section
        y_start += row_height + 4
        
        # Check page break before test results
        pdf.check_page_break(40)
        
        # Test Result Section - centered and compact like reference image
        table_width = 140  # Fixed width for compact table
        table_x_offset = (210 - table_width) / 2  # Center the table on page
        
        pdf.set_xy(table_x_offset, y_start)
        pdf.set_font('Times', 'B', 10)
        # Remove table border and add underline instead
        pdf.cell(table_width, 6, 'Test Result for Density and Compressive Strength of Concrete Cubes', 0, 1, 'C')
        
        # Add underline below the heading - only under the text, not full width
        pdf.set_line_width(0.5)
        # Calculate text width to position underline exactly under the text
        title_text = 'Test Result for Density and Compressive Strength of Concrete Cubes'
        text_width = pdf.get_string_width(title_text)
        text_start_x = table_x_offset + (table_width - text_width) / 2  # Center the text within table width
        pdf.line(text_start_x, y_start + 6, text_start_x + text_width, y_start + 6)
        
        # Test results table with compact columns - centered alignment
        y_start += 8  # Increased spacing after underline
        pdf.set_xy(table_x_offset, y_start)
        
        # Set thin line width for test results table
        pdf.set_line_width(0.2)
        
        # Set compact column widths to match reference image
        sr_width_res = 18      # Sr. No.
        id_width_res = 22      # ID Mark  
        density_width_res = 25 # Density (kg/m³)
        strength_width = 40    # Compressive Strength
        avg_width = 35         # Average Strength
        
        # Table headers - multi-line to prevent overlap
        header_height = 12  # Increased from 10 to 12 for better spacing
        pdf.set_font('Times', '', 10)  # Changed to regular font for table headers
        
        # Sr. No. header
        pdf.cell(sr_width_res, header_height, 'Sr. No.', 1, 0, 'C')
        
        # ID Mark header
        pdf.cell(id_width_res, header_height, 'ID Mark', 1, 0, 'C')
        
        # Density header
        pdf.cell(density_width_res, header_height, 'Density (kg/m³)', 1, 0, 'C')
        
        # Compressive Strength header - split into two lines
        x_pos = pdf.get_x()
        y_pos = pdf.get_y()
        pdf.cell(strength_width, header_height, '', 1, 0, 'C')  # Draw border
        pdf.set_xy(x_pos, y_pos + 2)
        pdf.cell(strength_width, 4, 'Compressive', 0, 0, 'C')
        pdf.set_xy(x_pos, y_pos + 6)
        pdf.cell(strength_width, 4, 'Strength (N/mm²)', 0, 0, 'C')
        
        # Average Compressive Strength header - split into two lines
        x_pos = pdf.get_x()
        y_pos = pdf.get_y() - 6  # Reset to header start
        pdf.set_xy(x_pos, y_pos)
        pdf.cell(avg_width, header_height, '', 1, 1, 'C')  # Draw border
        pdf.set_xy(x_pos, y_pos + 2)
        pdf.cell(avg_width, 4, 'Average Compressive', 0, 0, 'C')
        pdf.set_xy(x_pos, y_pos + 6)
        pdf.cell(avg_width, 4, 'Strength (N/mm²)', 0, 1, 'C')
        
        # Test result data - use actual database values from test_results_json or individual fields
        pdf.set_font('Times', '', 11)  # Increased from 10 to 11
        
        # Use actual compressive strength data from database - match number of cubes
        compressive_results = []
        cube_count = int(main_test.num_of_cubes or 1)
        
        if test_results and len(test_results) > 0:
            app.logger.debug(f"PDF Generation - Test results available for compressive strength, cube_count: {cube_count}")
            
            # Create entries for ALL cubes specified
            for i in range(cube_count):
                if i < len(test_results):
                    result = test_results[i]
                    
                    # Safe conversion for compressive strength - properly handle numeric values
                    strength_val = result.get('compressive_strength', 0)
                    try:
                        # Convert to float if it's a valid number
                        strength = float(strength_val) if strength_val not in [None, '', 0] else 0
                    except (ValueError, TypeError):
                        strength = 0
                    
                    # Use user-input average strength directly - no calculation
                    avg_strength = main_test.average_strength or 0
                    if avg_strength:
                        avg_strength = float(avg_strength)
                else:
                    # Use fallback values for missing cube data
                    strength = 0
                    avg_strength = main_test.average_strength or 0
                
                app.logger.debug(f"  Result {i+1}: strength={strength}, avg_strength={avg_strength}")
                
                # Use the actual cube_id from test results instead of database id_mark
                cube_id = str(result.get('cube_id', f"Cube {i+1}")) if i < len(test_results) else str(main_test.id_mark or "N/A")
                
                # Calculate density for this cube
                density = 0
                length = safe_float_convert(result.get('dimension_length'))
                width = safe_float_convert(result.get('dimension_width'))
                height = safe_float_convert(result.get('dimension_height'))
                weight = safe_float_convert(result.get('weight'))
                
                if (isinstance(length, (int, float)) and isinstance(width, (int, float)) and 
                    isinstance(height, (int, float)) and isinstance(weight, (int, float)) and 
                    length > 0 and width > 0 and height > 0 and weight > 0):
                    volume_m3 = (length * width * height) / 1000000000  # Convert mm³ to m³
                    density = weight / volume_m3 if volume_m3 > 0 else 0
                
                compressive_results.append([
                    str(i + 1),
                    cube_id[:12],
                    f"{density:.1f}" if density > 0 else "N/A",
                    f"{strength:.1f}" if strength > 0 else "Pending Observation",
                    f"{avg_strength:.1f}" if avg_strength is not None else "Pending Observation"
                ])
        
        # If no test results from JSON, use direct database values with proper cube count
        if not compressive_results:
            app.logger.debug(f"PDF Generation - Using database fields for compressive strength")
            app.logger.debug(f"  compressive_strength: {main_test.compressive_strength}")
            app.logger.debug(f"  average_strength: {main_test.average_strength}")
            app.logger.debug(f"  num_of_cubes: {cube_count}")
            
            # Create entries for each cube even if using database fallback
            base_strength = main_test.compressive_strength or 0
            avg_strength = main_test.average_strength or 0
            
            # Convert string values to float if needed
            try:
                base_strength = float(base_strength) if base_strength not in [None, '', 0] else 0
                avg_strength = float(avg_strength) if avg_strength not in [None, '', 0] else 0
            except (ValueError, TypeError):
                base_strength = 0
                avg_strength = 0
            
            for i in range(cube_count):
                # Calculate density from database values
                density = 0
                if (main_test.dimension_length and main_test.dimension_width and 
                    main_test.dimension_height and main_test.weight):
                    volume_m3 = (main_test.dimension_length * main_test.dimension_width * main_test.dimension_height) / 1000000000
                    density = main_test.weight / volume_m3 if volume_m3 > 0 else 0
                
                compressive_results.append([
                    str(i + 1),
                    str(main_test.id_mark or "N/A")[:12], 
                    f"{density:.1f}" if density > 0 else "N/A",
                    f"{base_strength:.1f}" if base_strength > 0 else "Pending Observation",
                    f"{avg_strength:.1f}" if avg_strength is not None else "Pending Observation"
                ])
        
        # Display the compressive strength results - centered and compact
        y_start += header_height  # Account for taller header
        for i, row in enumerate(compressive_results):
            pdf.set_xy(table_x_offset, y_start)
            
            pdf.set_font('Times', '', 10)  # Changed to Times Regular 10pt for table data
            pdf.cell(sr_width_res, row_height, row[0], 1, 0, 'C')
            pdf.cell(id_width_res, row_height, row[1], 1, 0, 'C')
            pdf.cell(density_width_res, row_height, row[2], 1, 0, 'C')
            pdf.cell(strength_width, row_height, row[3], 1, 0, 'C')
            
            # Only show average strength in first row (merged cell effect)
            if i == 0:
                # Add yellow highlight for Average Compressive Strength value
                avg_strength_text = row[4]
                text_width = pdf.get_string_width(avg_strength_text)
                cell_x = pdf.get_x()
                cell_y = pdf.get_y()
                
                # Calculate highlight position to stay within cell boundaries
                highlight_x = cell_x + (avg_width - text_width) / 2 - 3  # Center the highlight with more padding
                highlight_y = cell_y + (row_height * len(compressive_results) - 6) / 2  # Center vertically with more padding
                highlight_width = text_width + 6  # Wider for better visibility
                highlight_height = 6  # Increased height for better visibility
                
                # Draw yellow highlight rectangle
                pdf.set_fill_color(255, 255, 0)  # Yellow background
                pdf.rect(highlight_x, highlight_y, highlight_width, highlight_height, 'F')  # Highlight rectangle
                pdf.set_fill_color(255, 255, 255)  # Reset to white background
                
                # Draw the cell with the highlighted text
                pdf.set_font('Times', 'B', 12)  # Average strength value uses 12pt bold font (kept as is)
                pdf.cell(avg_width, row_height * len(compressive_results), row[4], 1, 1, 'C')
            else:
                # Move to next line for subsequent rows without drawing average cell
                pdf.ln()
            
            y_start += row_height
        
        # Add Terms & Conditions section - increased spacing for better visual separation
        y_start += row_height + 8  # Increased spacing from -4 to +8 for better gap
        pdf.check_page_break(40)  # Check space for terms
        
        pdf.set_xy(10, y_start)
        pdf.set_font('Times', 'B', 11)  # Increased font size from 9 to 11
        pdf.cell(190, 4, 'Terms & Conditions :-', 0, 1, 'L')
        
        # Updated Terms & Conditions - increased spacing between heading and rules
        pdf.set_font('Times', '', 10)  # Increased font size from 9 to 10
        y_start += 6  # Increased spacing from 3 to 6 to add padding below heading
        
        terms = [
            "1) Samples were not drawn by Vitrag Associates LLP lab.",
            "2) The Test Reports & Results pertain to Sample/ Samples of material received by Vitrag Associates LLP lab.",
            "3) The Test Report cannot be reproduced without the written approval of CEO/QM of Vitrag Associates LLP lab.",
            "4) Any change/ correction/ alteration to the Test Report shall be invalid.",
            "5) The role VAs is restricted to testing of the material sample as received in the laboratory. Vitrag Associates LLP lab or any of its employees shall not be liable for any dispute/ litigation arising between the customer & Third Party on account of test results. Vitrag Associates LLP lab shall not interact with any Third Party in this regard.",
            "6) The CEO of Vitrag Associates LLP lab may make necessary changes to the terms & conditions without any prior notice."
        ]
        
        for term in terms:
            pdf.set_xy(10, y_start)
            # Use multi_cell for long terms to handle wrapping
            if len(term) > 80:
                pdf.multi_cell(190, 4, term, 0, 'L')  # Increased line height from 3 to 4
                y_start = pdf.get_y() + 0.5  # Add 0.5mm extra spacing
            else:
                pdf.cell(190, 4, term, 0, 1, 'L')  # Increased line height from 3 to 4
                y_start += 4.5  # Increased from 3 to 4.5 (4 + 0.5mm extra spacing)
        
        # Add signature blocks with increased gap between terms and authorization
        y_start += 12  # Increased spacing from 8 to 12 to create more gap before signatures
        pdf.check_page_break(40)  # Check space for signatures and footer
        
        pdf.set_xy(10, y_start)
        
        # Split signature section: Reviewed by (left) and Authorized by (right)
        pdf.set_xy(10, y_start)
        
        # Left side - "Reviewed by" - better positioned
        pdf.set_font('Times', 'B', 10)  # Reduced font size from 11 to 10
        pdf.set_text_color(0, 80, 160)  # Blue color
        pdf.text(28, y_start, 'Reviewed by -')
        
        # Add stamp image in the center - better positioned
        stamp_paths = [
            os.path.join('static', 'images', 'stamp_clear.png'),
            os.path.join('static', 'images', 'stamp.png')
        ]
        for stamp_path in stamp_paths:
            if pdf.add_image_safe(stamp_path, x=90, y=y_start, w=30, h=30):
                break
        
        # Right side - "Authorized by" - better positioned
        pdf.set_font('Times', 'B', 10)  # Reduced font size from 11 to 10
        pdf.set_text_color(0, 80, 160)  # Blue color
        pdf.text(122, y_start, 'Authorized by -')
        
        # Add space for signatures - reduced gap
        y_start += 8
        
        # Left side - Reviewer details - with tab space
        pdf.set_font('Times', 'B', 10)  # Reduced font size from 11 to 10
        pdf.set_text_color(0, 80, 160)  # Blue color
        
        # Use selected reviewer info if available, otherwise default to Lalita
        app.logger.info(f"Page 1 - reviewer_info received: {reviewer_info}")
        if reviewer_info and reviewer_info.get('name'):
            reviewer_name = reviewer_info['name']
            reviewer_designation = reviewer_info['designation']
            reviewer_graduation = reviewer_info['graduation']
            app.logger.info(f"Page 1 - Using selected reviewer: {reviewer_name} - {reviewer_designation}")
        else:
            reviewer_name = 'Lalita S. Dussa'
            reviewer_designation = 'Quality Manager'
            reviewer_graduation = 'B.Tech.(Civil)'
            app.logger.info(f"Page 1 - Using default reviewer: {reviewer_name} - {reviewer_designation}")
        
        pdf.text(45, y_start, reviewer_name)
        
        # Reviewer designation
        y_start += 8
        pdf.set_font('Times', '', 9)  # Reduced font size from 10 to 9
        pdf.set_text_color(0, 80, 160)  # Blue color
        pdf.text(45, y_start, f'({reviewer_designation})')
        
        # Reviewer qualification
        y_start += 8
        pdf.set_font('Times', '', 9)  # Reduced font size from 10 to 9
        pdf.set_text_color(0, 80, 160)  # Blue color
        pdf.text(45, y_start, reviewer_graduation)
        
        # Right side - Authorized by details (Prakarsh) - with tab space
        auth_y = y_start - 16  # Reset to same level as reviewer
        pdf.set_font('Times', 'B', 10)  # Reduced font size from 11 to 10
        pdf.set_text_color(0, 80, 160)  # Blue color
        pdf.text(135, auth_y, 'Mr. Prakarsh A Sangave')
        
        # Authorized designation - with tab space
        auth_y += 8
        pdf.set_font('Times', '', 9)  # Reduced font size from 10 to 9
        pdf.set_text_color(0, 80, 160)  # Blue color
        pdf.text(135, auth_y, '(Chief Executive Officer)')
        
        # Authorized qualifications - with tab space
        auth_y += 8
        pdf.set_font('Times', '', 9)  # Reduced font size from 10 to 9
        pdf.set_text_color(0, 80, 160)  # Blue color
        pdf.text(135, auth_y, 'M.E(Civil-Structures)')
        
        # Additional qualification - with tab space
        auth_y += 8
        pdf.set_font('Times', '', 9)  # Reduced font size from 10 to 9
        pdf.set_text_color(0, 80, 160)  # Blue color
        pdf.text(135, auth_y, 'MTech (Civil-Geotechnical), M.I.E, F.I.E.')
        
        # END OF ANNEXURE-I - POSITIONED TO AVOID FOOTER OVERLAP
        # Calculate position to ensure footer fits on same page
        end_report_y = 265  # Moved down from 260 to 265 to push footer down
        
        pdf.set_xy(10, end_report_y)
        pdf.set_font('Times', 'B', 10)
        pdf.set_text_color(0, 0, 0)
        
        end_text = 'X----------X----------X----------X----------X----------END OF REPORT----------X----------X----------X----------X----------X'
        pdf.cell(190, 4, end_text, 0, 1, 'C')
        
        # COMPACT FOOTER - positioned to avoid overlap
        footer_y = end_report_y + 6
        
        # Line 1: Address centered, Page number right
        pdf.set_xy(10, footer_y)
        pdf.set_text_color(255, 0, 0)
        pdf.set_font('Times', '', 8)
        pdf.cell(190, 4, '34A/26 West, New Pachha Peth, Ashok Chowk, Solapur', 0, 0, 'C')
        
        pdf.set_xy(150, footer_y)
        pdf.set_text_color(0, 0, 0)
        pdf.cell(50, 4, 'Page 1 of 1', 0, 0, 'R')
        
        # Line 2: VA/TR left, Contact center, Issue right
        footer_y += 4
        pdf.set_xy(10, footer_y)
        pdf.set_text_color(0, 0, 0)
        pdf.cell(50, 4, 'VA/TR/I-3/24', 0, 0, 'L')
        
        pdf.set_xy(10, footer_y)
        pdf.set_text_color(255, 0, 0)
        pdf.cell(190, 4, 'Mob. No.-9552529235, 8830263787, E-mail: vitragassociates3@gmail.com', 0, 0, 'C')
        
        pdf.set_xy(150, footer_y)
        pdf.set_text_color(0, 0, 0)
        pdf.cell(50, 4, 'Issue No. 03', 0, 0, 'R')
        
        # Generate second page with test images - FIXED TABLE FOR 3 CUBES
        add_test_images_page_fixed(pdf, test_request, main_test)
        
        # Generate third page with observations table and strength graph
        add_strength_graph_page(pdf, test_request, main_test, reviewer_info)
        
        # Save the PDF to file
        try:
            pdf.output(pdf_path)
            app.logger.debug(f"Successfully generated enhanced test report PDF: {pdf_path}")
            return True
        except Exception as e:
            app.logger.error(f"Error saving PDF: {e}")
            return False
            
    except Exception as e:
        app.logger.error(f"Error generating test report PDF: {e}")
        app.logger.error(traceback.format_exc())
        return False

def add_strength_graph_page(pdf, test_request, main_test, reviewer_info=None):
    """Add page 3 with observations table, graph and authorization - exact match to reference"""
    try:
        pdf.add_page()
        
        # Add standard header with same layout as page 1
        add_standard_header(pdf, 'Observations', page_number=2)
        
        # Title already added by standard header function
        
        # Create observations table - positioned after header with reduced spacing
        table_start_x = 15
        table_start_y = 45  # Reduced gap from 50 to 45 (5mm gap from heading)
        table_width = 180
        
        # Generate observations based on user input from graph generation page
        observations = []
        
        # Get user-selected observations from the database
        user_observations = {}
        try:
            if main_test.observations_json:
                import json
                user_observations = json.loads(main_test.observations_json)
                app.logger.info(f"Using user-selected observations: {user_observations}")
            else:
                app.logger.info("No user observations found, using default 'Satisfactory' values")
        except Exception as e:
            app.logger.error(f"Error parsing observations data: {e}")
            
        # 1. Compressive Strength acquired after specified duration - USER INPUT
        strength_result = user_observations.get('obs_strength_duration', '--')
        
        observations.append({
            "sl": "1.", 
            "description": "Compressive Strength acquired after specified duration", 
            "result": strength_result
        })
        
        # 2. Individual test results within ±15% of average strength - USER INPUT
        individual_results = user_observations.get('obs_test_results', '--')
        
        observations.append({
            "sl": "2.", 
            "description": "Individual test results within ±15% of average strength", 
            "result": individual_results
        })
        
        # 3. Weight of cube - USER INPUT
        weight_result = user_observations.get('obs_weight', '--')
        
        observations.append({
            "sl": "3.", 
            "description": "Weight of cube", 
            "result": weight_result
        })
        
        # 4. Type of failure Pattern - USER INPUT
        failure_pattern_result = user_observations.get('obs_failure_pattern', '--')
        
        observations.append({
            "sl": "4.", 
            "description": "Type of failure Pattern as per IS 516(Part-1/Sec-1): - 2021 Fig 1", 
            "result": failure_pattern_result
        })
        
        # 5. Bonding between Aggregates and cement paste - USER INPUT
        bonding_result = user_observations.get('obs_bonding', '--')
        
        observations.append({
            "sl": "5.", 
            "description": "Bonding between Aggregates and cement paste.", 
            "result": bonding_result
        })
        
        # 6. Compressive Strength acceptance criteria - USER INPUT
        acceptance_result = user_observations.get('obs_strength_criteria', '--')
        
        observations.append({
            "sl": "6.", 
            "description": "Compressive Strength as per acceptance criteria as C1,16.1 of IS 456:2000 (Fck+4) From Table No.11", 
            "result": acceptance_result
        })
        
        row_height = 6  # Reduced row height for most rows
        last_row_height = 9  # Special height for last row
        col1_width = 15  # S.No column
        col2_width = 125  # Description column  
        col3_width = 40   # Result column
        
        # Calculate total table height with last row being 9mm
        total_height = row_height * (len(observations) - 1) + last_row_height
        
        # Draw table border - thinner lines
        pdf.set_draw_color(0, 0, 0)
        pdf.set_line_width(0.2)
        pdf.rect(table_start_x, table_start_y, table_width, total_height)
        
        # Draw column lines
        pdf.line(table_start_x + col1_width, table_start_y, table_start_x + col1_width, table_start_y + total_height)
        pdf.line(table_start_x + col1_width + col2_width, table_start_y, table_start_x + col1_width + col2_width, table_start_y + total_height)
        
        # Draw horizontal lines for each row
        for i in range(1, len(observations)):
            if i == 5:  # 6th row (index 5) - 9mm height
                y_pos = table_start_y + row_height * 5  # After 5 rows of 6mm each
            else:
                y_pos = table_start_y + row_height * i
            pdf.line(table_start_x, y_pos, table_start_x + table_width, y_pos)
        
        # Fill table content
        pdf.set_font('Times', '', 11)  # Increased font size from 8 to 11
        for i, obs in enumerate(observations):
            if i == 5:  # 6th row (index 5) - 9mm height
                y_pos = table_start_y + row_height * 5 + 4.5  # Position after 5 rows of 6mm each, centered in 9mm
            else:  # Other rows - 6mm height
                y_pos = table_start_y + row_height * i + 4  # Centered in 6mm row height
            
            # S.No column - centered
            pdf.text(table_start_x + 7, y_pos, obs["sl"])
            
            # Description column (compact text wrapping)
            desc_text = obs["description"]
            if len(desc_text) > 70:  # Adjusted threshold for smaller font
                # Split long text into two lines more intelligently
                words = desc_text.split()
                line1 = ""
                line2 = ""
                for word in words:
                    if len(line1 + word + " ") <= 70 and line2 == "":
                        line1 += word + " "
                    else:
                        line2 += word + " "
                
                # Display wrapped text with left alignment
                if i == 5:  # 6th row - adjust for 9mm height with more gap, moved down
                    pdf.text(table_start_x + col1_width + 3, y_pos - 1, line1.strip())
                    if line2.strip():
                        pdf.text(table_start_x + col1_width + 3, y_pos + 3, line2.strip())
                else:  # Other rows - adjust for 6mm height
                    pdf.text(table_start_x + col1_width + 3, y_pos - 1, line1.strip())
                    if line2.strip():
                        pdf.text(table_start_x + col1_width + 3, y_pos + 1, line2.strip())
            else:
                # Left aligned description text
                pdf.text(table_start_x + col1_width + 3, y_pos, desc_text)
            
            # Result column - properly centered in the column
            result_text = obs["result"]
            result_width = pdf.get_string_width(result_text)
            result_center_x = table_start_x + col1_width + col2_width + (col3_width - result_width) / 2
            pdf.text(result_center_x, y_pos, result_text)
        
        # Add graph section - with increased spacing between table and graph
        graph_start_y = table_start_y + row_height * len(observations) + 12  # Increased gap between observation table and graph
        
        try:
            # Get test results data from the database
            from app import db
            from models import ConcreteTest
            
            concrete_tests = db.session.query(ConcreteTest).filter_by(
                test_request_id=test_request.id
            ).all()
            
            if concrete_tests and concrete_tests[0].test_results_json:
                import json
                json_data = json.loads(concrete_tests[0].test_results_json)
                strength_data = json_data.get('strength_data', {})
                
                if strength_data.get('has_data'):
                    # Use the same graph generation function as the strength graph page
                    graph_base64 = generate_strength_graph_for_pdf(strength_data)
                    
                    if graph_base64:
                        # Decode base64 and save as temporary file
                        import base64
                        import tempfile
                        
                        try:
                            # Decode base64 image
                            graph_data = base64.b64decode(graph_base64)
                            
                            # Create temporary file
                            temp_graph_path = tempfile.mktemp(suffix='.png')
                            with open(temp_graph_path, 'wb') as f:
                                f.write(graph_data)
                            
                            # Add graph with border - reduced width to eliminate blank space
                            graph_x = 40  # Centered: (210-130)/2 = 40mm from left margin
                            graph_y = graph_start_y
                            graph_w = 130  # Reduced width from 150 to 130 to eliminate blank space
                            graph_h = 70   # New height
                            
                            # Draw border around graph
                            pdf.set_draw_color(0, 0, 0)
                            pdf.set_line_width(0.5)
                            pdf.rect(graph_x, graph_y, graph_w, graph_h)
                            
                            if os.path.exists(temp_graph_path):
                                # Position content to fit better in the 130mm box
                                content_offset = 5  # Reduced offset for smaller box
                                pdf.add_image_safe(temp_graph_path, x=graph_x + 1 + content_offset, y=graph_y + 1, w=120, h=graph_h - 2)  
                            
                            # Graph caption - positioned below graph
                            pdf.set_font('Times', 'B', 10)
                            pdf.set_text_color(0, 0, 0)
                            pdf.text(40, graph_y + graph_h + 5, 'Fig. 2 - Graphical Representation of Comparison of Compressive Strengths')
                            
                            # Clean up
                            try:
                                os.remove(temp_graph_path)
                            except:
                                pass
                                
                        except Exception as e:
                            app.logger.error(f"Error processing graph image: {e}")
                            # Fallback message
                            pdf.set_font('Times', '', 12)
                            pdf.text(70, graph_start_y + 40, 'Graph processing failed')
                    else:
                        # No graph generated
                        pdf.set_font('Times', '', 12)
                        pdf.text(70, graph_start_y + 40, 'Graph generation failed')
                else:
                    pdf.set_font('Times', '', 12)
                    pdf.text(70, graph_start_y + 40, 'No strength data available for graph')
            else:
                pdf.set_font('Times', '', 12)
                pdf.text(70, graph_start_y + 40, 'No test results data available')
                    
        except Exception as e:
            app.logger.error(f"Error adding graph to PDF: {e}")
            pdf.set_font('Times', '', 12)
            pdf.text(70, graph_start_y + 40, 'Graph generation failed')
        
        # Authorization section - positioned after graph with proper spacing
        auth_y = graph_start_y + 100  # Adjusted for new graph height (70mm + 30mm gap)
        
        # Split signature section: Reviewed by (left) and Authorized by (right) - same as page 1
        pdf.set_xy(10, auth_y)
        
        # Left side - "Reviewed by"
        pdf.set_font('Times', 'B', 11)  # Original font size
        pdf.set_text_color(0, 80, 160)  # Blue color
        pdf.text(28, auth_y, 'Reviewed by -')
        
        # Add stamp image in the center
        stamp_paths = [
            os.path.join('static', 'images', 'stamp_clear.png'),
            os.path.join('static', 'images', 'stamp.png')
        ]
        for stamp_path in stamp_paths:
            if pdf.add_image_safe(stamp_path, x=90, y=auth_y, w=30, h=30):
                break
        
        # Right side - "Authorized by"
        pdf.set_font('Times', 'B', 11)  # Original font size
        pdf.set_text_color(0, 80, 160)  # Blue color
        pdf.text(122, auth_y, 'Authorized by -')
        
        # Add space for signatures - reduced gap
        auth_y += 8
        
        # Left side - Reviewer details - with tab space
        pdf.set_font('Times', 'B', 11)  # Original font size
        pdf.set_text_color(0, 80, 160)  # Blue color
        
        # Use selected reviewer info if available, otherwise default to Lalita
        app.logger.info(f"Page 3 - reviewer_info received: {reviewer_info}")
        if reviewer_info and reviewer_info.get('name'):
            reviewer_name = reviewer_info['name']
            reviewer_designation = reviewer_info['designation']
            reviewer_graduation = reviewer_info['graduation']
            app.logger.info(f"Page 3 - Using selected reviewer: {reviewer_name} - {reviewer_designation}")
        else:
            reviewer_name = 'Lalita S. Dussa'
            reviewer_designation = 'Quality Manager'
            reviewer_graduation = 'B.Tech.(Civil)'
            app.logger.info(f"Page 3 - Using default reviewer: {reviewer_name} - {reviewer_designation}")
        
        pdf.text(45, auth_y, reviewer_name)
        
        # Reviewer designation
        auth_y += 8
        pdf.set_font('Times', '', 10)  # Original font size
        pdf.set_text_color(0, 80, 160)  # Blue color
        pdf.text(45, auth_y, f'({reviewer_designation})')
        
        # Reviewer qualification
        auth_y += 8
        pdf.set_font('Times', '', 10)  # Original font size
        pdf.set_text_color(0, 80, 160)  # Blue color
        pdf.text(45, auth_y, reviewer_graduation)
        
        # Right side - Authorized by details (Prakarsh) - with tab space
        auth_y = auth_y - 16  # Reset to same level as reviewer
        pdf.set_font('Times', 'B', 11)  # Original font size
        pdf.set_text_color(0, 80, 160)  # Blue color
        pdf.text(135, auth_y, 'Mr. Prakarsh A Sangave')
        
        # Authorized designation - with tab space
        auth_y += 8
        pdf.set_font('Times', '', 10)  # Original font size
        pdf.set_text_color(0, 80, 160)  # Blue color
        pdf.text(135, auth_y, '(Chief Executive Officer)')
        
        # Authorized qualifications - with tab space
        auth_y += 8
        pdf.set_font('Times', '', 10)  # Original font size
        pdf.set_text_color(0, 80, 160)  # Blue color
        pdf.text(135, auth_y, 'M.E(Civil-Structures)')
        
        # Additional qualification - with tab space
        auth_y += 8
        pdf.set_font('Times', '', 10)  # Original font size
        pdf.set_text_color(0, 80, 160)  # Blue color
        pdf.text(135, auth_y, 'MTech (Civil-Geotechnical), M.I.E, F.I.E.')
        
        # END OF REPORT text - centered with X markers, bold and larger font
        pdf.set_font('Times', 'B', 10)  # Increased font size from 10 to 14
        pdf.set_text_color(0, 0, 0)  # Black color
        end_text = 'X----------X----------X----------X----------END OF OBSERVATIONS----------X----------X----------X----------X'
        end_x = (210 - pdf.get_string_width(end_text)) / 2
        # Use fixed position to ensure visibility - positioned higher to prevent page overflow
        pdf.text(end_x, 265, end_text)
        
        # COMPACT FOOTER - positioned higher to prevent page overflow
        footer_y = 270
        
        # Line 1: Address centered, Page number right
        pdf.set_xy(10, footer_y)
        pdf.set_text_color(255, 0, 0)
        pdf.set_font('Times', '', 8)
        pdf.cell(190, 4, '34A/26 West, New Pachha Peth, Ashok Chowk, Solapur', 0, 0, 'C')
        
        pdf.set_xy(150, footer_y)
        pdf.set_text_color(0, 0, 0)
        pdf.cell(50, 4, 'Page 3 of 3', 0, 0, 'R')
        
        # Line 2: VA/TR left, Contact center, Issue right
        footer_y += 4
        pdf.set_xy(10, footer_y)
        pdf.set_text_color(0, 0, 0)
        pdf.cell(50, 4, 'VA/TR/I-3/24', 0, 0, 'L')
        
        pdf.set_xy(10, footer_y)
        pdf.set_text_color(255, 0, 0)
        pdf.cell(190, 4, 'Mob. No.-9552529235, 8830263787, E-mail: vitragassociates3@gmail.com', 0, 0, 'C')
        
        pdf.set_xy(150, footer_y)
        pdf.set_text_color(0, 0, 0)
        pdf.cell(50, 4, 'Issue No. 03', 0, 0, 'R')
        
    except Exception as e:
        app.logger.error(f"Error adding observations page: {e}")

def generate_strength_graph_for_pdf(strength_data):
    """Generate strength graph for PDF - same as web page but returns base64"""
    try:
        import matplotlib.pyplot as plt
        import matplotlib
        import numpy as np
        import io
        import base64
        
        matplotlib.use('Agg')
        
        # Set the font family and size for the plot
        plt.rcParams['font.family'] = 'sans-serif'
        plt.rcParams['font.size'] = 9
        
        # Clear any previous plots
        plt.clf()
        
        # Create figure and axis with exact dimensions to match reference
        fig, ax = plt.subplots(figsize=(8, 4))
        
        # Set up day labels exactly as in reference image
        days = ['7 days strength', '14 days strength', '28 days strength']
        
        # Extract values and ensure they are all floats, using 0 for None/empty values
        try:
            required_7 = float(strength_data.get('required_7') or 0)
            required_14 = float(strength_data.get('required_14') or 0)
            required_28 = float(strength_data.get('required_28') or 0)
            actual_7 = float(strength_data.get('actual_7') or 0)
            actual_14 = float(strength_data.get('actual_14') or 0)
            actual_28 = float(strength_data.get('actual_28') or 0)
        except (ValueError, TypeError) as e:
            app.logger.error(f"Error converting strength values: {str(e)}")
            required_7, required_14, required_28 = 0, 0, 0
            actual_7, actual_14, actual_28 = 0, 0, 0
        
        required_strength = [required_7, required_14, required_28]
        actual_strength = [actual_7, actual_14, actual_28]
        
        # Set width of bar - keep original width
        bar_width = 0.15
        
        # Set position of bars on X axis - reduced spacing between 7 and 14 days
        r1 = np.array([0, 0.6, 1.2])  # Custom positions: 7days=0, 14days=0.6, 28days=1.2
        r2 = [x + bar_width for x in r1]
        
        # Set x-axis limits to accommodate closer bar spacing
        ax.set_xlim(-0.2, 1.5)  # Adjusted to fit the closer bar positions
        
        # Create bars with original colors
        rects1 = ax.bar(r1, required_strength, width=bar_width, label='Required strength N/mm2', color='steelblue')
        rects2 = ax.bar(r2, actual_strength, width=bar_width, label='Actual Cube strength', color='orange')
        
        # Add title in the exact style as in the reference image
        ax.set_title('Graphical presentation of compressive strength', fontsize=10)
        
        # Configure y-axis to match the reference image with larger font
        max_val = max(max(required_strength), max(actual_strength)) if any(required_strength + actual_strength) else 35
        ax.set_ylim(0, max(35, max_val * 1.1))
        ax.set_yticks(np.arange(0, max(36, max_val * 1.1), 5))
        ax.set_ylabel('Strength N/mm2', fontsize=16, labelpad=0)  # Increased from 12 to 16
        ax.tick_params(axis='y', labelsize=14, labelleft=True, labelright=False)  # Move Y-axis numbers back to left side
        
        # Configure x-axis with better spacing to prevent overlap
        ax.set_xticks([r + bar_width/2 for r in r1])
        ax.set_xticklabels([])
        
        # Add day labels BELOW the graph - reduced gap
        for i in range(len(days)):
            pos_x = r1[i] + bar_width/2
            # Position day labels BELOW the graph with reduced gap
            ax.text(pos_x, -max_val * 0.05, days[i], ha='center', va='top', fontsize=8, rotation=0)
        
        # Create values table BELOW the chart - moved to LEFT side
        table_y = -max_val * 0.25  # Position table below the chart
        
        # Table headers - positioned on LEFT side with proper alignment
        # Add blue square for Required strength
        ax.text(-0.75, table_y, '■', fontsize=12, color='steelblue', ha='center', va='center')
        ax.text(-0.65, table_y, 'Required strength N/mm2', fontsize=8, ha='left', va='center')
        
        # Add orange square for Actual strength
        ax.text(-0.75, table_y - max_val * 0.08, '■', fontsize=12, color='orange', ha='center', va='center')
        ax.text(-0.65, table_y - max_val * 0.08, 'Actual Cube strength', fontsize=8, ha='left', va='center')
        
        # Table values - positioned below their corresponding bars
        for i in range(len(days)):
            col_x = r1[i] + bar_width/2  # Center under each bar group
            
            # Required strength values
            if required_strength[i] > 0:
                ax.text(col_x, table_y, f"{required_strength[i]}", ha='center', va='center', fontsize=8)
            
            # Actual strength values
            if actual_strength[i] > 0:
                ax.text(col_x, table_y - max_val * 0.08, f"{actual_strength[i]:.2f}", ha='center', va='center', fontsize=8)
        
        # Values are now positioned directly below bars, no separate table needed
        
        # Move legend to bottom with horizontal layout
        ax.legend(loc='upper center', bbox_to_anchor=(0.5, -0.4), ncol=2, fontsize=7, frameon=False)
        
        # Add grid
        ax.grid(axis='y', linestyle='-', alpha=0.15)
        
        # Add border
        for spine in ax.spines.values():
            spine.set_linewidth(0.5)
            spine.set_color('black')
        
        # White background
        ax.set_facecolor('white')
        fig.patch.set_facecolor('white')
        
        # Add more padding at bottom for legend and labels
        plt.subplots_adjust(bottom=0.35)
        
        # Convert to base64
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', dpi=100, bbox_inches='tight', facecolor='white')
        buffer.seek(0)
        image_png = buffer.getvalue()
        buffer.close()
        plt.close()
        
        if image_png:
            graph = base64.b64encode(image_png).decode('utf-8')
            return graph
        else:
            return None
            
    except Exception as e:
        app.logger.error(f"Error generating graph for PDF: {e}")
        return None

def add_test_images_page_fixed(pdf, test_request, main_test):
    """Add page 3 with test images - enhanced with better image handling"""
    try:
        pdf.add_page()
        
        # Add standard header with ANNEXURE - I title
        add_standard_header(pdf, 'ANNEXURE - I', page_number=3)
        
        # Get test photos
        try:
            from models import TestPhoto, ConcreteTest
            
            test_photos = []
            try:
                concrete_tests = ConcreteTest.query.filter_by(test_request_id=test_request.id).all()
                if concrete_tests:
                    for concrete_test in concrete_tests:
                        photos = TestPhoto.query.filter_by(concrete_test_id=concrete_test.id).all()
                        test_photos.extend(photos)
                        app.logger.debug(f"Found {len(photos)} photos for concrete test {concrete_test.id}")
            except Exception as e:
                app.logger.error(f"Error getting test photos: {e}")
                test_photos = []
            
            # Create exact table structure as in reference image
            table_start_x = 15
            table_start_y = 45  # Reduced gap between title and table
            cell_width = 60
            cell_height = 50  # Reduced height to eliminate gaps
            header_height = 12
            
            # Generate table based on user's selected cube count from test creation
            photo_grid = {}
            for photo in test_photos:
                cube_num = getattr(photo, 'cube_number', 1)
                photo_type = getattr(photo, 'photo_type', 'unknown')
                
                if cube_num not in photo_grid:
                    photo_grid[cube_num] = {}
                photo_grid[cube_num][photo_type] = photo
            
            # Use actual cube count from user input when creating test
            user_cube_count = int(main_test.num_of_cubes or 1)
            cube_numbers = list(range(1, user_cube_count + 1))
            actual_cube_count = user_cube_count
            app.logger.debug(f"Creating image table for {actual_cube_count} cubes as specified by user")
            
            # Dynamic table height based on user's cube count + caption
            caption_row_height = 6  # Further reduced caption height
            total_table_height = header_height + cell_height * actual_cube_count + caption_row_height
            
            # Draw main table border with correct height (including caption row) 
            pdf.set_draw_color(0, 0, 0)
            pdf.set_line_width(0.2)  # Thin borders
            pdf.rect(table_start_x, table_start_y, cell_width * 3, total_table_height)
            
            # Column headers with exact text from reference
            pdf.set_font('Times', 'B', 10)
            
            # Header 1: Pictorial View of Front side failure of cube specimen
            pdf.text(table_start_x + 5, table_start_y + 4, 'Pictorial View of Front side')
            pdf.text(table_start_x + 8, table_start_y + 8, 'failure of cube specimen')
            
            # Header 2: Digital reading of Load & Compressive Strength
            pdf.text(table_start_x + cell_width + 8, table_start_y + 4, 'Digital reading of Load &')
            pdf.text(table_start_x + cell_width + 10, table_start_y + 8, 'Compressive Strength')
            
            # Header 3: Pictorial View of Back side failure of Cube Specimen
            pdf.text(table_start_x + cell_width * 2 + 5, table_start_y + 4, 'Pictorial View of Back side')
            pdf.text(table_start_x + cell_width * 2 + 8, table_start_y + 8, 'failure of Cube Specimen')
            
            # Draw header separator line
            pdf.line(table_start_x, table_start_y + header_height, table_start_x + cell_width * 3, table_start_y + header_height)
            
            # Draw vertical lines for columns ONLY for content rows (NOT caption row)
            caption_start_y = table_start_y + header_height + cell_height * actual_cube_count
            pdf.line(table_start_x + cell_width, table_start_y, table_start_x + cell_width, caption_start_y)
            pdf.line(table_start_x + cell_width * 2, table_start_y, table_start_x + cell_width * 2, caption_start_y)
            
            # Draw horizontal lines for user-specified number of rows
            for row in range(1, actual_cube_count + 1):
                y_pos = table_start_y + header_height + cell_height * row
                pdf.line(table_start_x, y_pos, table_start_x + cell_width * 3, y_pos)
            
            # Draw horizontal line above caption row
            caption_line_y = table_start_y + header_height + cell_height * actual_cube_count
            pdf.line(table_start_x, caption_line_y, table_start_x + cell_width * 3, caption_line_y)

            
            # Fill grid with images or placeholders
            photo_types = ['front_failure', 'digital_reading', 'back_failure']
            image_width = 56  # Full cell width minus 2mm gap on each side
            image_height = 48  # Reduced height to create 2mm gap below images
            
            for row in range(actual_cube_count):  # User-specified cube count
                for col in range(3):  # 3 photo types
                    cube_num = cube_numbers[row]  # Use actual cube number
                    photo_type = photo_types[col]
                    
                    # Calculate cell position - 2mm gap on left and right sides
                    cell_x = table_start_x + col * cell_width + 2  # 2mm gap from left
                    cell_y = table_start_y + header_height + row * cell_height
                    
                    # Try to add image if available - SIMPLIFIED APPROACH
                    image_added = False
                    if cube_num in photo_grid and photo_type in photo_grid[cube_num]:
                        photo = photo_grid[cube_num][photo_type]
                        
                        # Try base64 photo_data - DIRECT approach
                        if hasattr(photo, 'photo_data') and photo.photo_data:
                            try:
                                import base64
                                import tempfile
                                
                                # Decode base64 image data
                                image_data = base64.b64decode(photo.photo_data)
                                
                                # Use PIL to process the image
                                from PIL import Image
                                import io
                                
                                # Create PIL image from base64 data
                                pil_image = Image.open(io.BytesIO(image_data))
                                
                                # Convert to RGB if necessary (removes alpha channel)
                                if pil_image.mode in ('RGBA', 'LA', 'P'):
                                    pil_image = pil_image.convert('RGB')
                                
                                # Preserve original quality - avoid unnecessary resizing
                                # Only resize if image is significantly larger than display area
                                original_size = pil_image.size
                                max_display_width = image_width * 6  # Allow 6x larger for maximum quality
                                max_display_height = image_height * 6
                                
                                if original_size[0] > max_display_width or original_size[1] > max_display_height:
                                    # Calculate scale factor to maintain aspect ratio
                                    scale_x = max_display_width / original_size[0]
                                    scale_y = max_display_height / original_size[1]
                                    scale = min(scale_x, scale_y)
                                    
                                    new_width = int(original_size[0] * scale)
                                    new_height = int(original_size[1] * scale)
                                    
                                    # Use highest quality resampling
                                    pil_image = pil_image.resize((new_width, new_height), Image.Resampling.LANCZOS)
                                
                                # Final size for PDF display - use exact cell dimensions for perfect layout
                                final_width = image_width
                                final_height = image_height
                                
                                # Create temporary file for the processed image with maximum quality
                                with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
                                    # Use maximum quality settings for crisp images
                                    pil_image.save(temp_file, format='JPEG', quality=100, optimize=False, subsampling=0)
                                    temp_image_path = temp_file.name
                                
                                # Add image to PDF filling entire cell - no centering, no gaps
                                if pdf.add_image_safe(temp_image_path, x=cell_x, y=cell_y, w=final_width, h=final_height):
                                    image_added = True
                                    app.logger.debug(f"Successfully added high-quality image for cube {cube_num}, type {photo_type}")
                                
                                # Clean up temporary file
                                try:
                                    os.unlink(temp_image_path)
                                except:
                                    pass
                                    
                            except Exception as e:
                                app.logger.error(f"Error processing photo data for cube {cube_num}: {e}")
                        
                        # Try file_path as fallback
                        elif hasattr(photo, 'file_path') and photo.file_path:
                            try:
                                if os.path.exists(photo.file_path):
                                    from PIL import Image
                                    import tempfile
                                    
                                    # Open and process image
                                    pil_image = Image.open(photo.file_path)
                                    
                                    # Convert to RGB if necessary
                                    if pil_image.mode in ('RGBA', 'LA', 'P'):
                                        pil_image = pil_image.convert('RGB')
                                    
                                    # Preserve original quality - same logic as base64 processing
                                    original_size = pil_image.size
                                    max_display_width = image_width * 6
                                    max_display_height = image_height * 6
                                    
                                    if original_size[0] > max_display_width or original_size[1] > max_display_height:
                                        scale_x = max_display_width / original_size[0]
                                        scale_y = max_display_height / original_size[1]
                                        scale = min(scale_x, scale_y)
                                        
                                        new_width = int(original_size[0] * scale)
                                        new_height = int(original_size[1] * scale)
                                        
                                        pil_image = pil_image.resize((new_width, new_height), Image.Resampling.LANCZOS)
                                    
                                    final_width = image_width
                                    final_height = image_height
                                    
                                    # Create high-quality temporary file
                                    with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
                                        pil_image.save(temp_file, format='JPEG', quality=100, optimize=False, subsampling=0)
                                        temp_image_path = temp_file.name
                                    
                                    # Add high-quality image to PDF filling entire cell - no gaps
                                    if pdf.add_image_safe(temp_image_path, x=cell_x, y=cell_y, w=final_width, h=final_height):
                                        image_added = True
                                        app.logger.debug(f"Successfully added high-quality file image for cube {cube_num}, type {photo_type}")
                                    
                                    # Clean up temporary file
                                    try:
                                        os.unlink(temp_image_path)
                                    except:
                                        pass
                                
                            except Exception as e:
                                app.logger.error(f"Error processing file image for cube {cube_num}: {e}")
                    
                    # Add placeholder text if no image - centered in cell with gap
                    if not image_added:
                        pdf.set_font('Times', '', 9)
                        pdf.text(cell_x + 20, cell_y + 20, f'Cube {cube_num}.0')
                        pdf.text(cell_x + 15, cell_y + 28, photo_type)
                        pdf.text(cell_x + 22, cell_y + 36, 'Missing')
            
            # Add caption row as part of the table (spanning all 3 columns)
            pdf.set_font('Times', 'B', 10)
            caption_row_y = table_start_y + header_height + cell_height * actual_cube_count
            caption_text_y = caption_row_y + 3  # Center text vertically in the further reduced row
            
            # Center the caption text across all three columns
            caption_text = 'Fig 1 - Pictorial view of Failure Pattern of Concrete Cube with Digital Readings'
            text_width = pdf.get_string_width(caption_text)
            text_x = table_start_x + (cell_width * 3 - text_width) / 2
            pdf.text(text_x, caption_text_y, caption_text)
            
                        # Add compressive strength formula below the table - clean layout
                        # Position + box
            formula_y = caption_row_y + caption_row_height + 8
            formula_x = 15
            formula_width = 130
            formula_height = 22  # enough space for fractions

            pdf.set_draw_color(0, 0, 0)
            pdf.set_line_width(0.5)
            pdf.rect(formula_x, formula_y, formula_width, formula_height)

            # "Compressive Strength = P/LB"
            pdf.set_font('Times', 'B', 12)
            pdf.text(formula_x + 5, formula_y + 12, 'Compressive Strength =')

            # P / LB fraction immediately after "Compressive Strength ="
            pdf.set_font('Times', '', 12)
            pdf.text(formula_x + 59, formula_y + 8, 'P')
            pdf.text(formula_x + 58, formula_y + 17, 'LB')
            pdf.line(formula_x + 55, formula_y + 11, formula_x + 64, formula_y + 11)

            # Equal sign
            pdf.set_font('Times', 'B', 12)
            pdf.text(formula_x + 70, formula_y + 13, '=')

            # Peak Load / Surface Area fraction
            pdf.set_font('Times', '', 11)
            pdf.text(formula_x + 82, formula_y + 8, 'Peak Load (N)')
            pdf.text(formula_x + 81, formula_y + 17, 'Surface Area (mm²)')
            pdf.line(formula_x + 78, formula_y + 11, formula_x + 110, formula_y + 11)


            
            # Add TEST WITNESSED section
            witness_y = formula_y + 30  # Increased gap after formula
            pdf.set_font('Times', 'B', 12)
            pdf.set_text_color(0, 31, 95)  # Color #001F5F (dark blue)
            pdf.text(15, witness_y, 'TEST WITNESSED:')
            
            # Add underline for TEST WITNESSED text with same color
            text_width = pdf.get_string_width('TEST WITNESSED:')
            pdf.set_draw_color(0, 31, 95)  # Same dark blue color
            pdf.set_line_width(0.5)
            pdf.line(15, witness_y + 1, 15 + text_width, witness_y + 1)
                

                
        except Exception as e:
            app.logger.error(f"Error adding test images: {e}")
            pdf.set_font('Times', '', 12)
            pdf.text(70, 100, 'Test images not available')
        
        # Add footer with proper colors and symmetrical positioning (same as page 1)
        y_start = 270
        pdf.set_xy(10, y_start)
        pdf.set_text_color(255, 0, 0)  # Red color for address
        pdf.set_font('Times', '', 8)
        pdf.cell(190, 4, '34A/26 West, New Pachha Peth, Ashok Chowk, Solapur', 0, 1, 'C')  # Full width center aligned
        
        y_start += 4
        pdf.set_xy(10, y_start)
        pdf.set_text_color(0, 0, 0)  # Black for VA/TR
        pdf.cell(50, 4, 'VA/TR/I-3/24', 0, 0, 'L')
        
        # Page number positioned top-right
        pdf.set_xy(150, y_start - 4)
        pdf.cell(50, 4, 'Page 2 of 3', 0, 1, 'R')
        
        pdf.set_xy(10, y_start)
        pdf.set_text_color(255, 0, 0)  # Red for contact info - full width center
        pdf.cell(190, 4, 'Mob. No.-9552529235, 8830263787, E-mail: vitragassociates3@gmail.com', 0, 1, 'C')
        
        pdf.set_xy(150, y_start)
        pdf.set_text_color(0, 0, 0)  # Black for issue number
        pdf.cell(50, 4, 'Issue No. 03', 0, 1, 'R')
        
    except Exception as e:
        app.logger.error(f"Error adding test images page: {e}")
