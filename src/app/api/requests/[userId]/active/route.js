import {pool} from '../../../../db'
import { NextResponse } from 'next/server';
export async function GET(req, {params}){
    const { userId } = await params;
    try {
        const res = await pool.query(`SELECT * FROM requests WHERE accepted_by = $1 AND status IN('accepted','picked_up')`,[userId])
        if(res.rows[0] === undefined){ return NextResponse.json(null) }
        return NextResponse.json(res.rows[0])
    } catch (error) {
        console.error(error)
        return NextResponse.json({error: 'Failed to get active requests.'},{status: 500})
    }
}
