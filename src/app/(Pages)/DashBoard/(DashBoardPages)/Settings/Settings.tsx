"use client"
import { RestaurantDetails } from '@/app/Types/Type';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useUpdateRestaurantDetails } from '@/app/services/restaurantService';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = React.useState('general');
  const [isEditing, setIsEditing] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState('');
  const {mutateAsync: updateRestaurantDetails, isLoading, isError, error} = useUpdateRestaurantDetails();
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<RestaurantDetails>({
    defaultValues: {
      _id: "",
      restaurant_name: "",
      restaurant_address: "",
      restaurant_phone_number: "",
      restaurant_email: "",
      restaurant_type: "",
      restaurant_description: "",
      restaurant_opening_time: "",
      restaurant_closing_time: "",
      restaurant_image: "",
      restaurant_cgst: "",
      restaurant_sgst: "",
      restaurant_discount: "",
      food_categories: [],
      isVegOnly: false,
      isCashOnly: false,
      restaurant_password: "",
      restaurant_confirmPassword: ""
    },
    mode: "onChange"
  });
  const [restaurant_id,setRestaurant_id] = React.useState<string>("");

  // Modify the useEffect to ensure values are set properly
  useEffect(() => {
    const savedDetails = localStorage.getItem('user');
    if (savedDetails) {
      const parsedDetails = JSON.parse(savedDetails).restaurant_details;
      setRestaurant_id(JSON.parse(savedDetails).id);
      // Set default values for all fields
      const formData = {
        restaurant_name: parsedDetails?.restaurant_name || "",
        restaurant_address: parsedDetails?.restaurant_address || "",
        restaurant_phone_number: parsedDetails?.restaurant_phone_number || "",
        restaurant_email: parsedDetails?.restaurant_email || "",
        restaurant_type: parsedDetails?.restaurant_type || "",
        restaurant_description: parsedDetails?.restaurant_description || "",
        restaurant_opening_time: parsedDetails?.restaurant_opening_time || "",
        restaurant_closing_time: parsedDetails?.restaurant_closing_time || "",
        restaurant_image: parsedDetails?.restaurant_image || "",
        restaurant_cgst: parsedDetails?.restaurant_cgst || "",
        restaurant_sgst: parsedDetails?.restaurant_sgst || "",
        restaurant_discount: parsedDetails?.restaurant_discount || "",
        food_categories: parsedDetails?.food_categories || [],
        isVegOnly: Boolean(parsedDetails?.isVegOnly),
        isCashOnly: Boolean(parsedDetails?.isCashOnly),
        restaurant_password: "",
        restaurant_confirmPassword: ""
      };
      reset(formData);
    }
    setMounted(true);
  }, [reset]);

  const handleEdit = () => {
    const savedDetails = localStorage.getItem('user');
    if (savedDetails) {
      const parsedDetails = JSON.parse(savedDetails).restaurant_details;
      // Ensure all form fields have defined values
      reset({
        restaurant_name: parsedDetails?.restaurant_name || "",
        restaurant_address: parsedDetails?.restaurant_address || "",
        restaurant_phone_number: parsedDetails?.restaurant_phone_number || "",
        restaurant_email: parsedDetails?.restaurant_email || "",
        restaurant_type: parsedDetails?.restaurant_type || "",
        restaurant_description: parsedDetails?.restaurant_description || "",
        restaurant_opening_time: parsedDetails?.restaurant_opening_time || "",
        restaurant_closing_time: parsedDetails?.restaurant_closing_time || "",
        restaurant_image: parsedDetails?.restaurant_image || "",
        restaurant_cgst: parsedDetails?.restaurant_cgst || "",
        restaurant_sgst: parsedDetails?.restaurant_sgst || "",
        restaurant_discount: parsedDetails?.restaurant_discount || "",
        food_categories: parsedDetails?.food_categories || [],
        isVegOnly: parsedDetails?.isVegOnly || false,
        isCashOnly: parsedDetails?.isCashOnly || false,
        restaurant_password: "",
        restaurant_confirmPassword: ""
      });
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    const savedDetails = localStorage.getItem('user');
    if (savedDetails) {
      const parsedDetails = JSON.parse(savedDetails).restaurant_details;
      reset(parsedDetails);
    }
    setIsEditing(false);
  };

  const onSubmit = async (data: RestaurantDetails) => {
    // Check for empty fields
    const requiredFields = [
      'restaurant_name',
      'restaurant_address',
      'restaurant_phone_number',
      'restaurant_email',
      'restaurant_type',
      'restaurant_description',
      'restaurant_opening_time',
      'restaurant_closing_time',
      'restaurant_image',
      'restaurant_cgst',
      'restaurant_sgst',
      'restaurant_discount',
    ];

    const emptyFields = requiredFields.filter(field => !data[field as keyof RestaurantDetails]);
    
    if (emptyFields.length > 0) {
      toast.error(`Please fill in all required fields: ${emptyFields.join(', ')}`);
      return;
    }

    // Existing password validation
    if (data.restaurant_password) {
      if (data.restaurant_password.length < 6) {
        return;
      }
      if (data.restaurant_password !== data.restaurant_confirmPassword) {
        return;
      }
    }

    const payload = {
      restaurant_name: data.restaurant_name,
      restaurant_address: data.restaurant_address,
      restaurant_phone_number: data.restaurant_phone_number,
      restaurant_email: data.restaurant_email,
      restaurant_type: data.restaurant_type,
      restaurant_description: data.restaurant_description,
      restaurant_opening_time: data.restaurant_opening_time,
      restaurant_closing_time: data.restaurant_closing_time,
      restaurant_image: data.restaurant_image,
      restaurant_cgst: data.restaurant_cgst,
      restaurant_sgst: data.restaurant_sgst,
      restaurant_discount: data.restaurant_discount,
      food_categories: data.food_categories,
      isVegOnly: data.isVegOnly,
      isCashOnly: data.isCashOnly
    }
    try {
      await updateRestaurantDetails({
        restaurant_id: restaurant_id,
        payload: payload,
      });
      
      // Update localStorage only after successful API call
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.restaurant_details = data;
      localStorage.setItem('user', JSON.stringify(user));
      
      setIsEditing(false);
    } catch (error) {
      // API call failed, don't update localStorage
      toast.error("Failed to update restaurant details:");
    }
    }
  

  // Modify the return statement to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  const formValues = watch(); // Get current form values

  const renderTabs = () => (
    <div className="mb-6 border-b border-gray-200">
      <nav className="flex space-x-8" aria-label="Tabs">
        {['general', 'additional', 'personal'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Info
          </button>
        ))}
      </nav>
    </div>
  );

  const renderGeneralInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
        {isEditing ? (
          <input
            {...register('restaurant_name')}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
          />
        ) : (
          <p className="p-2 bg-gray-50 rounded-md text-gray-700">{formValues.restaurant_name ?? ''}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Image URL</label>
        {isEditing ? (
          <input
            type="url"
            {...register('restaurant_image')}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
          />
        ) : (
          <p className="p-2 bg-gray-50 rounded-md text-gray-700">{formValues.restaurant_image ?? ''}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        {isEditing ? (
          <input
            type="text"
            {...register('restaurant_address')}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
          />
        ) : (
          <p className="p-2 bg-gray-50 rounded-md text-gray-700">{formValues.restaurant_address ?? ''}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        {isEditing ? (
          <input
            type="tel"
            {...register('restaurant_phone_number')}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
          />
        ) : (
          <p className="p-2 bg-gray-50 rounded-md text-gray-700">{formValues.restaurant_phone_number ?? ''}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        {isEditing ? (
          <input
            type="email"
            {...register('restaurant_email')}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
          />
        ) : (
          <p className="p-2 bg-gray-50 rounded-md text-gray-700">{formValues.restaurant_email ?? ''}</p>
        )}
      </div>
    </div>
  );

  const renderAdditionalInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Type</label>
        {isEditing ? (
          <input
            {...register('restaurant_type')}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
          />
        ) : (
          <p className="p-2 bg-gray-50 rounded-md text-gray-700">{formValues.restaurant_type ?? ''}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        {isEditing ? (
          <textarea
            {...register('restaurant_description')}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
            rows={3}
          />
        ) : (
          <p className="p-2 bg-gray-50 rounded-md text-gray-700">{formValues.restaurant_description ?? ''}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Opening Time</label>
          {isEditing ? (
            <input
              type="time"
              {...register('restaurant_opening_time')}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
            />
          ) : (
            <p className="p-2 bg-gray-50 rounded-md text-gray-700">{formValues.restaurant_opening_time ?? ''}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Closing Time</label>
          {isEditing ? (
            <input
              type="time"
              {...register('restaurant_closing_time')}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
            />
          ) : (
            <p className="p-2 bg-gray-50 rounded-md text-gray-700">{formValues.restaurant_closing_time ?? ''  }</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CGST (%)</label>
          {isEditing ? (
            <input
              type="number"
              {...register('restaurant_cgst')}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
            />
          ) : (
            <p className="p-2 bg-gray-50 rounded-md text-gray-700">{formValues.restaurant_cgst ?? ''}%</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SGST (%)</label>
          {isEditing ? (
            <input
              type="number"
              {...register('restaurant_sgst')}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
            />
          ) : (
            <p className="p-2 bg-gray-50 rounded-md text-gray-700">{formValues.restaurant_sgst ?? ''}%</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
          {isEditing ? (
            <input
              type="number"
              {...register('restaurant_discount')}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
            />
          ) : (
            <p className="p-2 bg-gray-50 rounded-md text-gray-700">{formValues.restaurant_discount ?? ''}%</p>
          )}
        </div>
      </div>

      <div className="flex gap-16">
        <div className="flex items-center">
          <label className="relative inline-flex items-center cursor-pointer">
            {isEditing ? (
              <input
                type="checkbox"
                {...register('isVegOnly')}
                className="sr-only peer"
              />
            ) : (
              <input
                type="checkbox"
                checked={formValues.isVegOnly}
                disabled
                className="sr-only peer"
              />
            )}
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
            <span className="ml-3 text-sm font-medium text-gray-700">Veg Only Restaurant</span>
          </label>
        </div>

        <div className="flex items-center">
          <label className="relative inline-flex items-center cursor-pointer">
            {isEditing ? (
              <input
              type="checkbox"
              {...register('isCashOnly')}
              className="sr-only peer"
            />
            ) : (
              <input
                type="checkbox"
                checked={formValues.isCashOnly}
                disabled
                className="sr-only peer"
              />
            )}
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
            <span className="ml-3 text-sm font-medium text-gray-700">Cash Only Payment</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Food Categories</label>
        {isEditing ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
                placeholder="Enter a category"
              />
              <button
                type="button"
                onClick={() => {
                  if (newCategory.trim()) {
                    const currentCategories = watch('food_categories') || [];
                    setValue('food_categories', [...currentCategories, newCategory.trim()]);
                    setNewCategory('');
                  }
                }}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {watch('food_categories')?.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-gray-300 px-3 py-1 rounded-full"
                >
                  <span>{category}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const currentCategories = watch('food_categories') || [];
                      setValue('food_categories', currentCategories.filter((_, i) => i !== index));
                    }}
                    className="text-gray-800 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {formValues.food_categories?.map((category, index) => (
              <span
                key={index}
                className="bg-gray-100 px-3 py-1 rounded-full text-gray-700"
              >
                {category}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        {isEditing ? (
          <input
            type="password"
            {...register('restaurant_password', {
              minLength: { value: 6, message: 'Password must be at least 6 characters long' }
            })}
            className={`w-full p-2 border ${errors.restaurant_password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-black focus:outline-none`}
            placeholder="Enter new password"
          />
        ) : (
          <p className="p-2 bg-gray-50 rounded-md text-gray-700">••••••••</p>
        )}
        {errors.restaurant_password && (
          <p className="mt-1 text-sm text-red-500">{errors.restaurant_password.message}</p>
        )}
      </div>
      
      {isEditing && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
            type="password"
            {...register('restaurant_confirmPassword')}
            className={`w-full p-2 border ${errors.restaurant_confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-black focus:outline-none`}
            placeholder="Confirm new password"
          />
        </div>
      )}
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralInfo();
      case 'additional':
        return renderAdditionalInfo();
      case 'personal':
        return renderPersonalInfo();
      default:
        return null;
    }
  };

  return (
    <div className="mt-10 p-8 max-h-[88vh] overflow-auto">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Restaurant Settings</h1>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Details
            </button>
          )}
        </div>

        <div className="bg-slate-100 rounded-lg shadow-md p-6">
          {renderTabs()}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {renderActiveTab()}
            
            {isEditing && (
              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;