"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import generateBillImage from '../DashBoard/(DashBoardPages)/Billing/helpers/generateBillImage';
import DownloadIcon from '@mui/icons-material/Download';
import { useFetchCompletedSingleOrder, useFetchSingleOrder } from '@/app/services/orderService';
import LoaderComponent from '@/app/Components/Loader/LoaderComponent';
import Image from 'next/image';

const ViewBill = () => {
  const searchParams = useSearchParams();
  const billId = searchParams.get('id');
  const {data: completedOrder, isLoading: completedOrderLoading, isError: completedOrderError} = useFetchCompletedSingleOrder(billId!);
  const { data: order, isLoading: orderLoading, isError: orderError } = useFetchSingleOrder(billId!);
  const router = useRouter();
  const [billUrl, setBillUrl] = useState<string | null>(null);
  useEffect(() => {
    const generateBill = async () => {
      if(order?.order){
        const billImage = await generateBillImage(order?.order);
        setBillUrl(billImage);
      }else if(completedOrder?.order){
        const billImage = await generateBillImage(completedOrder?.order);
        setBillUrl(billImage);
      }
    };
    generateBill();
  }, [order, completedOrder]);

  const downloadBill = () => {
    const link = document.createElement('a');
    link.href = billUrl!;
    link.download = `Bill-${order?.order_number}.png`;
    document.body.appendChild(link);
  }
  if(orderLoading && completedOrderLoading){
    return <LoaderComponent/>
  }
  if(orderError && completedOrderError){
    return <div>
      <div className='flex justify-center items-center'>
        <p>Error fetching order</p>
        <button className='bg-slate-700 text-white px-4 py-2 rounded-md hover:bg-slate-600 transition-colors' onClick={() => router.back()}>Go Back</button>
      </div>
    </div>
  }
  return (
    <div className='my-10'>
      <div className='transition-opacity duration-300 ease-in-out'>
        {billUrl ? (
          <div className='animate-fade-in'>
            <div className='flex justify-center items-center'>
              <Image src={billUrl} alt="Bill" width={400} height={400} />
            </div>
            <div className='flex justify-center items-center mt-4'>
              <button className='bg-slate-700 text-white px-4 py-2 rounded-md hover:bg-slate-600 transition-colors' onClick={downloadBill}>
                <DownloadIcon/>&nbsp;Download
              </button>
            </div>
          </div>
        ) : (
          <LoaderComponent message='Please wait while we are generating the bill'/>
        )}
      </div>
    </div>
  )
}

export default ViewBill;
