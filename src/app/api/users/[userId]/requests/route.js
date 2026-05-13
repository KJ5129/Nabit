import {pool} from '../../../../db'
import { NextResponse } from 'next/server';
export async function GET(request,{params}){
    const { userId } = await params;
    try{
        const res = await pool.query(`SELECT * FROM requests WHERE requested_by = $1 and status IN('pending','accepted','picked_up','delivered')`,[userId]);
        return NextResponse.json(res.rows)
    } catch (error) {
        console.error(error)
        return NextResponse.json({message: 'Unable to get your active order.'},{status: 500})
    }
}
