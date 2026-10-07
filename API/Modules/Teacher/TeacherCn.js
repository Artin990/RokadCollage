import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Teacher from "./TeacherMd.js";
import { removePublicFile } from "../../Utils/fileHelper.js";

export const create = catchAsync(async (req, res, next) => {
  const { name, specialization, photo } = req.body;

  const newTeacher = await Teacher.create({
    name,
    specialization,
    photo,
  });

  return res.status(201).json({
    success: true,
    message: "معلم جدید با موفقیت ثبت شد",
    data: newTeacher,
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Teacher, req.query, req.role)
    .filter()
    .search(["name", "specialization"])
    .sort()
    .limitFields()
    .paginate()
    .populate();

  const result = await features.execute();
  return res.status(200).json(result);
});

export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Teacher, req.query, req.role)
    .addManualFilters({ _id: req.params.id })
    .limitFields()
    .populate();

  const result = await features.execute();
  const doc = Array.isArray(result) ? result[0] : result?.data ? result.data[0] : result;

  if (!doc) {
    return next(new HandleERROR("معلم مورد نظر یافت نشد", 404));
  }

  return res.status(200).json({
    success: true,
    data: doc,
  });
});

export const update = catchAsync(async (req, res, next) => {
  const allowedUpdates = ["name", "specialization", "photo"];
  const updates = {};

  Object.keys(req.body).forEach((el) => {
    if (allowedUpdates.includes(el)) updates[el] = req.body[el];
  });

  const oldTeacher = await Teacher.findById(req.params.id);
  if (!oldTeacher) {
    return next(new HandleERROR("معلم مورد نظر یافت نشد", 404));
  }

  // If photo changed, clean up previous file
  if (updates.photo && updates.photo !== oldTeacher.photo) {
    removePublicFile(oldTeacher.photo);
  }

  const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    message: "مشخصات معلم با موفقیت بروزرسانی شد",
    data: updatedTeacher,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);

  if (!deletedTeacher) {
    return next(new HandleERROR("معلم مورد نظر یافت نشد", 404));
  }

  // Clean up photo file if not default
  if (deletedTeacher.photo) {
    removePublicFile(deletedTeacher.photo);
  }

  return res.status(200).json({
    success: true,
    message: "معلم با موفقیت حذف شد",
    data: null,
  });
});
