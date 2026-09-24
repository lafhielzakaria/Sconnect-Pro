const repo = require('../../repositories/repositorie');
const TABLE = 'associations';

async function getAllObjects(table = TABLE, column = null, conditionValue = null) {
    if (column) {
        return await repo.index(table = "association_members", column, conditionValue);
    }
    return await repo.index(table);
}
async function updateObject(table, id, data) {
    return await repo.update(table, id, data);
}
async function getAssociationById(id) {
    console.log(id);
    return await repo.findById(TABLE, id);
}
async function priceCalculatore(personalData) {
    let consumptionFinished = 0;
    let basePrice = parseFloat(personalData.base_price);
    let finalPrice = basePrice;
    const familyId = personalData.family_id;
    const qf = parseFloat(personalData.quotient_familial);
    const registredFamilyMembersCount = 1;
    const applyMinimumCheck = () => {
        if (finalPrice < 15) {
            consumptionFinished = 1;
            finalPrice = 15;
        }
    };
    if (consumptionFinished == 0) {
        if (registredFamilyMembersCount === 1) {
            finalPrice -= basePrice * 0.15;
            applyMinimumCheck();
        }
        else if (registredFamilyMembersCount >= 2) {
            finalPrice -= basePrice * 0.30;
            applyMinimumCheck();
        }
        if (qf < 600) {
            finalPrice -= basePrice * 0.40;
            applyMinimumCheck();
        }
        else if (qf >= 600 && qf <= 900) {
            finalPrice -= basePrice * 0.20;
            applyMinimumCheck();
        }
    }
    finalPrice -= 50;
    applyMinimumCheck();
    const final_price = Math.max(
        Math.round(Number(finalPrice) * 100) / 100,
        15
    );

    const memberData = {
        association_id: personalData.association_id,
        member_id: personalData.member_id ?? null,
        family_id: personalData.family_id,
        first_name: personalData.first_name,
        last_name: personalData.last_name,
        email: personalData.email,
        phone: personalData.phone,
        date_of_birth: personalData.date_of_birth,
        is_resident: personalData.is_resident,
        quotient_familial: personalData.quotient_familial,
        medical_certificate_date: personalData.medical_certificate_date,
        pass_sport_code: personalData.pass_sport_code ?? null,
        final_price: final_price,
    };
    return memberData;
}
async function store(table = TABLE, data) {
    return await repo.save(table, data);
}
module.exports = {
    getAllObjects,
    getAssociationById,
    store,
    priceCalculatore,
    updateObject
};