'use server'
import { pool } from './db';

// BUG FIX: removed 'refreshSession' import from auth-client.
// auth-client uses browser APIs and cannot be called from a server action.
// Calling it here caused a runtime crash in the Node.js environment.

export async function setRole(role, userId) {
  try {
    await pool.query(
      `UPDATE "user" SET "activeRole" = $1, "onboardingComplete" = $2 WHERE "id" = $3`,
      [role, true, userId]
    );
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to set role.' };
  }
}

export async function addRequest(formData, userId) {
  try {
    await pool.query(
      `INSERT INTO requests (restaurant, drop_off_spot, delivery_contents, confirmation_number, room_floor, tip_amount, requested_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        formData.restaurant,
        formData.drop_off_spot,
        formData.delivery_contents,
        formData.confirmation_number,
        formData.room_floor,
        parseFloat(formData.tip_amount),
        userId,
      ]
    );
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to add a new request.' };
  }
}

export async function cancelRequest(orderId) {
  try {
    await pool.query(`UPDATE requests SET status = $1 WHERE id = $2`, ['cancelled', orderId]);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Order cancellation failed.' };
  }
}

export async function acceptRequest(deliverer, requestId) {
  try {
    await pool.query(
      `UPDATE requests SET status = $1, accepted_by = $2 WHERE id = $3`,
      ['accepted', deliverer, requestId]
    );
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Unable to accept request.' };
  }
}

export async function updateStatus(requestStatus, requestId) {
  try {
    await pool.query(`UPDATE requests SET status = $1 WHERE id = $2`, [requestStatus, requestId]);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Unable to update request status.' };
  }
}
