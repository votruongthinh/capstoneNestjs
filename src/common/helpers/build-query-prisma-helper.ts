export const buildQueryPrisma = (req: any) => {
  let { page, pageSize, filters, mo_ta, nguoi_dung_id } = req.query;

  // =========================
  // 1) KIỂM TRA CÓ DÙNG PHÂN TRANG HAY KHÔNG
  // =========================
  const hasPagination = page !== undefined || pageSize !== undefined;

  // =========================
  // 2) XỬ LÝ PAGE / PAGESIZE
  // =========================
  page = Number(page);
  pageSize = Number(pageSize);

  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(pageSize) || pageSize < 1) pageSize = 3;

  const index = (page - 1) * pageSize;

  // =========================
  // 3) XỬ LÝ FILTERS JSON
  // =========================
  try {
    filters = JSON.parse(filters);
  } catch (error) {
    filters = {};
  }

  if (!filters || typeof filters !== 'object') {
    filters = {};
  }

  // Nếu filter là string thì chuyển thành contains
  Object.entries(filters).forEach(([key, value]) => {
    if (typeof value === 'string') {
      filters[key] = {
        contains: value,
      };
    }
  });

  // =========================
  // 4) HỖ TRỢ QUERY PARAM TRỰC TIẾP
  // =========================
  if (mo_ta) {
    filters.mo_ta = {
      contains: mo_ta,
    };
  }

  if (nguoi_dung_id) {
    filters.nguoi_dung_id = Number(nguoi_dung_id);
  }

  // =========================
  // 5) WHERE CUỐI CÙNG
  // =========================
  const where = {
    ...filters,
    isDeleted: false,
  };

  console.log('buildQueryPrisma =>', {
    hasPagination,
    page,
    pageSize,
    index,
    where,
  });

  return {
    page,
    pageSize,
    index,
    where,
    hasPagination,
  };
};