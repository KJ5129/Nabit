import {pool} from '../../../db';
import { NextResponse } from 'next/server';
export async function GET(){
    try {
        const res = await pool.query(`SELECT * FROM requests WHERE status = $1`,['pending']);
        return NextResponse.json(res.rows)
    } catch (error) {
        console.error(error)
        return NextResponse.json({error: 'Failed to get open requests'}, {status: 500});
    }
}
