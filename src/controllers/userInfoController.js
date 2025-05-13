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

  const userInfo = user.UserInformation[0]

  res.render('user_info',{
    name: user.name,
    phone: user.phone,
    gender: user.gender,
    dietaryPrefs: ['VEGETARIAN', 'VEGAN', 'KETO', 'PALEO', 'LOW_CARB', 'OMNIVORE'],
    genders: ['MALE', 'FEMALE', 'OTHER'],
    activityLevels: ['SEDENTARY', 'LIGHT', 'MODERATE', 'ACTIVE', 'VERY_ACTIVE'], 
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

  // Step 3: Check and upsert userInformation
  const payload = {
    userId,
    bmi: parseFloat(bmi),
    dietaryPref,
    activityLevel,
    healthConditions,
    allergies,
    preferredCuisines,
    avoidedCuisines,
    medications,
    updatedAt: new Date().toISOString(),
  };

  // Using upsert to handle both insert and update
  const { error: upsertError } = await supabase
    .from('UserInformation')
    .upsert([payload], { onConflict: ['userId'] });

  if (upsertError) {
    console.error(upsertError);
    return res.status(500).json({ error: 'Failed to update user information' });
  }

  res.redirect('/user-info');
};
