'use client'

import React, { useState, useEffect } from 'react';

interface ShippingAddressProps {
  userId: string,
  accessToken: string,
}

export const ShippingAddress: React.FC<ShippingAddressProps> = ({ userId, accessToken }) => {
  return (
    <div>shipping-address</div>
  )
}
