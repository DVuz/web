import React, { useState, useRef, useEffect } from 'react';
import {
  Table,
  Image,
  Plus,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Link2,
  List,
  ListOrdered,
  Type,
  X,
  Palette,
  Trash2,
  Edit2,
} from 'lucide-react';

const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showTableEditModal, setShowTableEditModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableConfig, setTableConfig] = useState({ rows: 2, cols: 3 });
  const [linkUrl, setLinkUrl] = useState('');
  const [isInternalChange, setIsInternalChange] = useState(false);

  useEffect(() => {
    if (
      !isInternalChange &&
      editorRef.current &&
      value !== editorRef.current.innerHTML
    ) {
      editorRef.current.innerHTML = value;
    }
    setIsInternalChange(false);
  }, [value, isInternalChange]);

  // Theo dõi sự kiện click để xử lý table
  useEffect(() => {
    const handleClick = (e) => {
      const table = e.target.closest('table');
      if (table) {
        setSelectedTable(table);
      } else {
        setSelectedTable(null);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    if (editorRef.current) {
      setIsInternalChange(true);
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleTextColor = (color) => {
    execCommand('foreColor', color);
    setShowColorPicker(false);
  };

  const handleLink = () => {
    if (linkUrl) {
      execCommand('createLink', linkUrl);
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Kiểm tra kích thước file (ví dụ: max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should not exceed 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Tạo canvas để resize ảnh nếu cần
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Giới hạn kích thước tối đa
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;

          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const resizedImage = `<img src="${canvas.toDataURL('image/jpeg', 0.8)}" 
            alt="uploaded" style="max-width: 100%; height: auto; margin: 10px 0;"/>`;
          execCommand('insertHTML', resizedImage);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const createTable = () => {
    const { rows, cols } = tableConfig;
    let tableHTML = `
      <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
        <thead>
          <tr>
    `;

    // Header row
    for (let j = 0; j < cols; j++) {
      tableHTML += `
        <th style="border: 1px solid #ddd; padding: 8px; background-color: #f8f9fa;">
          Header ${j + 1}
        </th>
      `;
    }

    tableHTML += `
        </tr>
      </thead>
      <tbody>
    `;

    // Data rows
    for (let i = 0; i < rows - 1; i++) {
      tableHTML += '<tr>';
      for (let j = 0; j < cols; j++) {
        tableHTML += `
          <td style="border: 1px solid #ddd; padding: 8px;">
            Cell ${i + 1}-${j + 1}
          </td>
        `;
      }
      tableHTML += '</tr>';
    }

    tableHTML += `
      </tbody>
    </table>
    `;

    execCommand('insertHTML', tableHTML);
    setShowTableModal(false);
  };

  const editTable = () => {
    if (!selectedTable) return;

    // Thêm hàng
    const addRow = () => {
      const tbody = selectedTable.querySelector('tbody');
      const newRow = document.createElement('tr');
      const colCount = selectedTable.querySelector('tr').cells.length;

      for (let i = 0; i < colCount; i++) {
        const cell = document.createElement('td');
        cell.style.cssText = 'border: 1px solid #ddd; padding: 8px;';
        cell.textContent = `New Cell ${i + 1}`;
        newRow.appendChild(cell);
      }

      tbody.appendChild(newRow);
      onChange(editorRef.current.innerHTML);
    };

    // Thêm cột
    const addColumn = () => {
      const rows = selectedTable.querySelectorAll('tr');
      rows.forEach((row, index) => {
        const cell =
          index === 0
            ? document.createElement('th')
            : document.createElement('td');
        cell.style.cssText = 'border: 1px solid #ddd; padding: 8px;';
        cell.textContent = index === 0 ? 'New Header' : 'New Cell';
        row.appendChild(cell);
      });
      onChange(editorRef.current.innerHTML);
    };

    // Xóa hàng
    const deleteRow = (rowIndex) => {
      const tbody = selectedTable.querySelector('tbody');
      tbody.deleteRow(rowIndex);
      onChange(editorRef.current.innerHTML);
    };

    // Xóa cột
    const deleteColumn = (colIndex) => {
      const rows = selectedTable.querySelectorAll('tr');
      rows.forEach((row) => {
        row.deleteCell(colIndex);
      });
      onChange(editorRef.current.innerHTML);
    };
  };

  const handleInput = (event) => {
    setIsInternalChange(true);
    onChange(event.currentTarget.innerHTML);
  };

  const commonButtonClass =
    'p-2 border rounded hover:bg-gray-200 text-gray-700';
  const colors = ['black', 'red', 'blue', 'green', 'purple', 'orange'];

  const TableModal = ({ isEdit = false }) => (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 min-w-[300px]'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-semibold'>
            {isEdit ? 'Edit Table' : 'Insert Table'}
          </h3>
          <button
            onClick={() =>
              isEdit ? setShowTableEditModal(false) : setShowTableModal(false)
            }
            className='text-gray-500 hover:text-gray-700'
          >
            <X size={20} />
          </button>
        </div>

        {isEdit ? (
          <div className='space-y-4'>
            <button
              onClick={() => {
                if (selectedTable) {
                  const tbody = selectedTable.querySelector('tbody');
                  const newRow = tbody.insertRow();
                  const cols = selectedTable.querySelector('tr').cells.length;

                  for (let i = 0; i < cols; i++) {
                    const cell = newRow.insertCell();
                    cell.style.cssText =
                      'border: 1px solid #ddd; padding: 8px;';
                    cell.textContent = `New Cell ${i + 1}`;
                  }

                  onChange(editorRef.current.innerHTML);
                }
                setShowTableEditModal(false);
              }}
              className='w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 mb-2'
            >
              Add Row
            </button>
            <button
              onClick={() => {
                if (selectedTable) {
                  const rows = selectedTable.rows;
                  for (let i = 0; i < rows.length; i++) {
                    const cell =
                      i === 0
                        ? document.createElement('th')
                        : document.createElement('td');
                    cell.style.cssText =
                      'border: 1px solid #ddd; padding: 8px;';
                    cell.textContent = i === 0 ? 'New Header' : 'New Cell';
                    rows[i].appendChild(cell);
                  }
                  onChange(editorRef.current.innerHTML);
                }
                setShowTableEditModal(false);
              }}
              className='w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700'
            >
              Add Column
            </button>
          </div>
        ) : (
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <span>Rows:</span>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() =>
                    setTableConfig((prev) => ({
                      ...prev,
                      rows: Math.max(2, prev.rows - 1),
                    }))
                  }
                  className='p-1 border rounded hover:bg-gray-100'
                >
                  <Minus size={16} />
                </button>
                <span className='w-8 text-center'>{tableConfig.rows}</span>
                <button
                  onClick={() =>
                    setTableConfig((prev) => ({ ...prev, rows: prev.rows + 1 }))
                  }
                  className='p-1 border rounded hover:bg-gray-100'
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <span>Columns:</span>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() =>
                    setTableConfig((prev) => ({
                      ...prev,
                      cols: Math.max(1, prev.cols - 1),
                    }))
                  }
                  className='p-1 border rounded hover:bg-gray-100'
                >
                  <Minus size={16} />
                </button>
                <span className='w-8 text-center'>{tableConfig.cols}</span>
                <button
                  onClick={() =>
                    setTableConfig((prev) => ({ ...prev, cols: prev.cols + 1 }))
                  }
                  className='p-1 border rounded hover:bg-gray-100'
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <button
              onClick={createTable}
              className='w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700'
            >
              Insert Table
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className='border rounded-md'>
      <div className='flex flex-wrap gap-2 p-2 border-b bg-gray-50'>
        {/* Text Formatting */}
        <div className='flex gap-1 border-r pr-2'>
          <button
            onClick={() => execCommand('bold')}
            className={commonButtonClass}
            type='button'
            title='Bold'
          >
            <Bold size={18} />
          </button>
          <button
            onClick={() => execCommand('italic')}
            className={commonButtonClass}
            type='button'
            title='Italic'
          >
            <Italic size={18} />
          </button>
          <button
            onClick={() => execCommand('underline')}
            className={commonButtonClass}
            type='button'
            title='Underline'
          >
            <Underline size={18} />
          </button>
        </div>

        {/* Lists */}
        <div className='flex gap-1 border-r pr-2'>
          <button
            onClick={() => execCommand('insertUnorderedList')}
            className={commonButtonClass}
            type='button'
            title='Bullet List'
          >
            <List size={18} />
          </button>
          <button
            onClick={() => execCommand('insertOrderedList')}
            className={commonButtonClass}
            type='button'
            title='Numbered List'
          >
            <ListOrdered size={18} />
          </button>
        </div>

        {/* Alignment */}
        <div className='flex gap-1 border-r pr-2'>
          <button
            onClick={() => execCommand('justifyLeft')}
            className={commonButtonClass}
            type='button'
            title='Align Left'
          >
            <AlignLeft size={18} />
          </button>
          <button
            onClick={() => execCommand('justifyCenter')}
            className={commonButtonClass}
            type='button'
            title='Center'
          >
            <AlignCenter size={18} />
          </button>
          <button
            onClick={() => execCommand('justifyRight')}
            className={commonButtonClass}
            type='button'
            title='Align Right'
          >
            <AlignRight size={18} />
          </button>
        </div>

        {/* Color Picker */}
        <div className='relative'>
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className={commonButtonClass}
            type='button'
            title='Text Color'
          >
            <Palette size={18} />
          </button>
          {showColorPicker && (
            <div className='absolute top-full left-0 mt-1 p-2 bg-white border rounded shadow-lg z-10 flex gap-1'>
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleTextColor(color)}
                  className='w-6 h-6 border rounded'
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>

        {/* Link */}
        <div className='relative'>
          <button
            onClick={() => setShowLinkInput(!showLinkInput)}
            className={commonButtonClass}
            type='button'
            title='Insert Link'
          >
            <Link2 size={18} />
          </button>
          {showLinkInput && (
            <div className='absolute top-full left-0 mt-1 p-2 bg-white border rounded shadow-lg z-10 flex gap-1'>
              <input
                type='text'
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder='Enter URL'
                className='border rounded px-2 py-1'
              />
              <button onClick={handleLink} className={commonButtonClass}>
                Add
              </button>
            </div>
          )}
        </div>

        {/* Image Upload */}
        <div className='relative'>
          <input
            type='file'
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept='image/*'
            className='hidden'
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className={commonButtonClass}
            type='button'
            title='Insert Image'
          >
            <Image size={18} />
          </button>
        </div>

        {/* Table */}
        <div className='flex gap-1'>
          <button
            onClick={() => setShowTableModal(true)}
            className={commonButtonClass}
            type='button'
            title='Insert Table'
          >
            <Table size={18} />
          </button>
          {selectedTable && (
            <button
              onClick={() => setShowTableEditModal(true)}
              className={commonButtonClass}
              type='button'
              title='Edit Table'
            >
              <Edit2 size={18} />
            </button>
          )}
        </div>

        {/* Clear Formatting */}
        <button
          onClick={() => execCommand('removeFormat')}
          className={commonButtonClass}
          type='button'
          title='Clear Formatting'
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div
        ref={editorRef}
        className='p-2 min-h-[150px] focus:outline-none'
        contentEditable
        onInput={handleInput}
      />

      {showTableModal && <TableModal />}
      {showTableEditModal && <TableModal isEdit={true} />}
    </div>
  );
};

export default RichTextEditor;
