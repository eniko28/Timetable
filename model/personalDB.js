export async function insertPersonal(db, id, photo, address, email, phone) {
  try {
    const query =
      'INSERT INTO Personal (id, profilePicture, address, email, phone) VALUES (:id, :photo, :address, :email, :phone)';
    await db.query(query, {
      params: {
        id,
        photo,
        address,
        email,
        phone,
      },
    });
  } catch (error) {
    console.error('Error inserting Personal:', error);
    throw error;
  }
}

export async function updatePersonal(db, id, photo, address, email, phone) {
  try {
    const query =
      'UPDATE Personal SET profilePicture = :photo, address = :address, email = :email, phone = :phone WHERE id = :id';
    await db.query(query, {
      params: {
        id,
        photo,
        address,
        email,
        phone,
      },
    });
  } catch (error) {
    console.error('Error updating Personal:', error);
    throw error;
  }
}

export async function getUserData(db, userId) {
  try {
    const query = `SELECT FROM Personal WHERE id = '${userId}'`;
    const info = await db.query(query);
    return info[0];
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}
