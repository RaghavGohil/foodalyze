import { supabase } from "../services/supabaseClient.js";

export const getUserInfo = async (req, res) => {
  const authUserId = req.user.id; // assuming auth middleware decoded JWT and put the user ID here

  const { data: user, error: userError } = await supabase
    .from('User')
    .select(`
      id,
      name,
      phone,
      gender,
      UserInformation (
        id,
        bmi,
        dietaryPref,
        activityLevel,
        healthConditions,
        allergies,
        preferredCuisines,
        avoidedCuisines,
        medications
      )
    `)
    .eq('authUserId', authUserId)
    .single();

  if (userError) {
    console.error('Error fetching user info:', userError);
    return res.status(500).json({ error: 'Failed to fetch user information' });
  }

  const userInfo = user.user_information?.[0] || null;

  res.render('user_info',{
    name: user.name,
    phone: user.phone,
    gender: user.gender,
    ...userInfo,
  });
};

export const updateUserInfo = async (req, res) => {
  const authUserId = req.user.id;

  const {
    name,
    phone,
    gender,
    bmi,
    dietaryPref,
    activityLevel,
    healthConditions,
    allergies,
    preferredCuisines,
    avoidedCuisines,
    medications,
  } = req.body;

  // Step 1: Get the user
  const { data: user, error: userError } = await supabase
    .from('User')
    .select('id')
    .eq('authUserId', authUserId)
    .single();

  if (userError || !user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const userId = user.id;

  // Step 2: Update user basic info
  const { error: updateUserError } = await supabase
    .from('User')
    .update({ name, phone, gender })
    .eq('id', userId);

  if (updateUserError) {
    console.error(updateUserError);
    return res.status(500).json({ error: 'Failed to update user' });
  }

  // Step 3: Check if user_information exists
  const { data: infoData, error: infoError } = await supabase
    .from('userInformation')
    .select('id')
    .eq('userId', userId)
    .single();

  const payload = {
    userId,
    bmi: parseFloat(bmi),
    dietaryPref,
    activityLevel,
    healthConditions,
    allergies: allergies,
    preferredCuisines: preferredCuisines,
    avoidedCuisines: avoidedCuisines,
    medications: medications,
  };

  let result;
  if (infoData) {
    // Update
    result = await supabase
      .from('UserInformation')
      .update(payload)
      .eq('userId', userId);
  } else {
    // Insert
    result = await supabase.from('UserInformation').insert(payload);
  }

  if (result.error) {
    console.error(result.error);
    return res.status(500).json({ error: 'Failed to update user information' });
  }

  res.render('user-info');
};
