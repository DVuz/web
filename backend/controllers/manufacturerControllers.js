const manufacturerService = require('../services/manufacturerService');
const path = require('path');
const fs = require('fs');

exports.createManufacturer = async (req, res) => {
  try {
    let imagePath = null;

    if (req.file) {
      // Tạo đường dẫn tương đối cho database
      imagePath = `/uploads/manufacturers/${req.file.filename}`;
    }

    const manufacturerData = {
      manufacturer_name: req.body.manufacturer_name?.trim(),
      contact_info: req.body.contact_info,
      address: req.body.address?.trim(),
      phone_number: req.body.phone_number?.trim(),
      email: req.body.email?.trim(),
      logo_url: imagePath,
      status: req.body.status || 'active',
    };

    const result =
      await manufacturerService.createManufacturer(manufacturerData);

    if (result.success) {
      res.status(201).json(result);
    } else {
      // Xóa file nếu tạo manufacturer thất bại
      if (req.file) {
        const filePath = path.join(__dirname, '..', req.file.path);
        fs.unlink(filePath, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }
      res.status(400).json(result);
    }
  } catch (error) {
    // Xóa file nếu có lỗi
    if (req.file) {
      const filePath = path.join(__dirname, '..', req.file.path);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllManufacturers = async (req, res) => {
  try {
    const result = await manufacturerService.getAllManufacturers();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getManufacturerById = async (req, res) => {
  try {
    const result = await manufacturerService.getManufacturerById(req.params.id);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateManufacturer = async (req, res) => {
  try {
    let imagePath = null;

    if (req.file) {
      imagePath = `/uploads/manufacturers/${req.file.filename}`;
    }

    const manufacturerData = {
      manufacturer_name: req.body.manufacturer_name?.trim(),
      contact_info: req.body.contact_info,
      address: req.body.address?.trim(),
      phone_number: req.body.phone_number?.trim(),
      email: req.body.email?.trim(),
      status: req.body.status,
    };

    // Chỉ cập nhật logo_url nếu có file mới
    if (imagePath) {
      manufacturerData.logo_url = imagePath;
    }

    const result = await manufacturerService.updateManufacturer(
      req.params.id,
      manufacturerData
    );

    if (result.success) {
      // Nếu cập nhật thành công và có file mới, xóa file cũ
      if (req.file && result.oldLogoUrl) {
        const oldFilePath = path.join(__dirname, '..', result.oldLogoUrl);
        fs.unlink(oldFilePath, (err) => {
          if (err) console.error('Error deleting old file:', err);
        });
      }
      res.json(result);
    } else {
      // Xóa file mới nếu cập nhật thất bại
      if (req.file) {
        const filePath = path.join(__dirname, '..', req.file.path);
        fs.unlink(filePath, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }
      res.status(400).json(result);
    }
  } catch (error) {
    // Xóa file mới nếu có lỗi
    if (req.file) {
      const filePath = path.join(__dirname, '..', req.file.path);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteManufacturer = async (req, res) => {
  try {
    const result = await manufacturerService.deleteManufacturer(req.params.id);
    if (!result.success) {
      return res.status(400).json(result);
    }

    // Xóa file logo nếu tồn tại
    if (result.logoUrl) {
      const filePath = path.join(__dirname, '..', result.logoUrl);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getActiveManufacturers = async (req, res) => {
  try {
    const result = await manufacturerService.getActiveManufacturers();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
