import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Formik, Form, useFormik } from 'formik'
import * as yup from 'yup'
import { Button, Tooltip } from '@mui/material'
import Preview from './Preview'
import BillImgForm from './BillImgForm'
import BillForm from './BillForm'
import SplitForm from './SplitForm'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { useDispatch } from 'react-redux'
import { getExpenseFormById, updateExpenseForm } from '../../redux/slices/expenseFormSlice'
import { useSelector } from 'react-redux'
import { getUsersByIds } from '../../redux/slices/usersSlice'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { saveAppState } from '../../redux/slices/appSlice'
import ShowMembers from '../showMembers/ShowMembers'

const ExpenseForm = () => {
  const uploadBillImgRef = useRef()
  const { expenseFormId } = useParams()
  const expenseForm = useSelector((state) => state.expenseForm)
  const users = useSelector((state) => state.users)
  const dispatch = useDispatch()

  const validationSchema = yup.object().shape({
    billDesc: yup.array().of(yup.string()),
    billPrice: yup.array().of(yup.number()),
    total: yup.number(),
    billImg: yup.object()
  })
  const intitalValues = {
    name: '',
    billDesc: [''],
    billPrice: [0],
    total: 0,
    billImg: '',
    billImgTotal: 0,
    isBillForm: false,
    members: [
      {
        id: '',
        owned: 0,
        note: '',
        fixed: false
      },
      {
        id: '',
        owned: 0,
        note: '',
        fixed: false
      },
      {
        id: '',
        owned: 0,
        note: '',
        fixed: false
      }
    ]
  }
  const formik = useFormik({
    initialValues: intitalValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2))
    }
  })
  useEffect(() => {
    dispatch(saveAppState({ membersIcon: true }))
  }, [])
  //helper functions
  const handleFixedCheck = (e, index) => {
    if (formik.values.members[index].fixed) {
      formik.handleChange(e)
      return
    }
    const fixedCnt = formik.values.members.reduce((cnt, current) => {
      if (current.fixed) {
        return ++cnt
      }
      return cnt
    }, 0)
    if (fixedCnt === formik.values.members.length - 1) {
      return
    }
    formik.handleChange(e)
  }
  const clickUploadBill = () => {
    uploadBillImgRef.current.click()
  }
  const setImgValue = (e) => {
    const newMembers = [...formik.values.members]
    const average = formik.values.billImgTotal / newMembers.length
    newMembers.map((elem, index) => {
      elem.owned = average
    })
    formik.setValues({
      ...formik.values,
      billImg: e.target.files[0],
      members: newMembers,
      total: formik.values.billImgTotal
    })
  }
  const removeBillImg = () => {
    uploadBillImgRef.current.value = null
    formik.setValues({ ...formik.values, billImg: null, total: 0 })
  }
  const handleDescChange = (e, index) => {
    const billDescArr = [...formik.values.billDesc]
    billDescArr[index] = e.target.value
    formik.setValues({ ...formik.values, billDesc: billDescArr })
  }
  const getFixedTotal = (membersArr) => {
    return membersArr.reduce((fixedOwned, current) => {
      if (current.fixed) {
        return (fixedOwned += current.owned)
      }
      return fixedOwned
    }, 0)
  }
  const getFixedCount = (membersArr) => {
    return membersArr.reduce((count, current) => {
      if (current.fixed) {
        return ++count
      }
      return count
    }, 0)
  }
  const getTotal = (billPriceArr) => {
    return billPriceArr.reduce((prev, curr) => prev + curr)
  }
  const toggleBillForm = () => {
    //update total, members
    const newMembers = [...formik.values.members]
    let newTotal = 0
    if (formik.values.isBillForm) {
      newMembers.map((elem, index) => {
        elem.owned = 0
        elem.fixed = false
      })
    } else {
      newTotal = getTotal(formik.values.billPrice)
      const average = newTotal / newMembers.length
      newMembers.map((elem, index) => {
        elem.owned = average
        elem.fixed = false
      })
    }
    formik.setValues({
      ...formik.values,
      total: newTotal,
      members: newMembers,
      isBillForm: !formik.values.isBillForm
    })
  }

  const handleOwnedChange = (e, index) => {
    //update members with new Average
    const value = Number(e.target.value)
    const newMembers = [...formik.values.members]
    newMembers[index].owned = value
    const fixedTotal = getFixedTotal(newMembers)
    if (
      value < 0 ||
      value > formik.values.total ||
      fixedTotal > formik.values.total ||
      !formik.values.members[index].fixed
    ) {
      return
    }
    const fixedCount = getFixedCount(newMembers)
    const restAverage =
      (formik.values.total - fixedTotal) / (formik.values.members.length - fixedCount)
    newMembers.forEach((elem, i) => {
      if (!elem.fixed && i != index) {
        elem.owned = restAverage
      }
    })
    formik.setValues({
      ...formik.values,
      members: newMembers
    })
  }
  const handlePriceChange = (e, index) => {
    //update members, total, billPrice
    const value = Number(e.target.value)

    const billPriceArr = [...formik.values.billPrice]
    billPriceArr[index] = value

    const newMembers = [...formik.values.members]

    const newTotal = getTotal(billPriceArr)
    const fixedCount = getFixedCount(newMembers)
    const fixedTotal = getFixedTotal(newMembers)
    if (newTotal < fixedTotal) {
      return
    } else {
      const restAverage = (newTotal - fixedTotal) / (newMembers.length - fixedCount)
      newMembers.forEach((elem, index) => {
        if (!elem.fixed) {
          elem.owned = restAverage
        }
      })
      formik.setValues({
        ...formik.values,
        members: newMembers,
        billPrice: billPriceArr,
        total: newTotal
      })
    }
  }
  const editBillForm = (e, operation, index) => {
    //handle adding or removing billPrice and billDesc
    //update total, billPrice, billDesc
    const currLength = formik.values.billDesc.length

    const billDescArr = [...formik.values.billDesc]
    const billPriceArr = [...formik.values.billPrice]
    if (operation === 'add') {
      billDescArr[currLength] = ''
      billPriceArr[currLength] = 0
    } else if (operation === 'remove' && currLength > 1) {
      billDescArr.splice(index, 1)
    }
    const newMembers = [...formik.values.members]
    const newTotal = getTotal(billPriceArr)
    const fixedCount = getFixedCount(newMembers)
    const fixedTotal = getFixedTotal(formik.values.members)
    if (newTotal < fixedTotal) {
      return
    }
    const restAverage = (newTotal - fixedTotal) / (newMembers.length - fixedCount)
    newMembers.forEach((elem, index) => {
      if (!elem.fixed) {
        elem.owned = restAverage
      }
    })
    formik.setValues({
      ...formik.values,
      billPrice: billPriceArr,
      billDesc: billDescArr,
      total: newTotal,
      members: newMembers
    })
  }
  const handleBillImgTotalChange = (e) => {
    //update members, total
    const value = Number(e.target.value)
    const newTotal = value
    const newMembers = [...formik.values.members]

    const fixedCount = getFixedCount(newMembers)
    const fixedTotal = getFixedTotal(formik.values.members)
    if (newTotal < fixedTotal) {
      return
    } else {
      const restAverage = (newTotal - fixedTotal) / (newMembers.length - fixedCount)
      newMembers.forEach((elem, index) => {
        if (!elem.fixed) {
          elem.owned = restAverage
        }
      })
      formik.setValues({
        ...formik.values,
        members: newMembers,
        total: newTotal
      })
    }
  }
  const handleUpdateForm = () => {
    dispatch(updateExpenseForm(formik.values))
  }
  useEffect(() => {
    if (formik.values.billImg) {
      formik.setValues({ ...formik.values, billImgTotal: formik.values.total })
    }
  }, [formik.values.total])
  useEffect(() => {
    onSnapshot(doc(db, 'ExpenseForms', expenseFormId), (doc) => {
      dispatch(getExpenseFormById(expenseFormId))
    })
  }, [])

  useEffect(() => {
    if (expenseForm.status === 'succeeded') {
      const memberIds = expenseForm.data.members.map((elem) => elem.id)
      if (users.status === 'idle') {
        dispatch(getUsersByIds(memberIds))
      }
      const expenseFormData = JSON.parse(JSON.stringify(expenseForm.data))
      expenseFormData.billImg = null
      formik.setValues({ ...formik.values, ...expenseFormData })
    }
  }, [expenseForm])

  if (!formik.values || users.status !== 'succeeded' || expenseForm.status !== 'succeeded') {
    return null
  }
  return (
    <>
      <Formik
        className="ExpenseForm"
        onSubmit={formik.handleSubmit}
        style={{ textAlign: 'left', margin: '10px 20px' }}
      >
        <Form>
          <Preview file={formik.values.billImg} removeBillImg={removeBillImg} />
          <Tooltip
            title={
              formik.values.isBillForm
                ? 'Only the bill image or the bill form'
                : 'Upload a receipt image'
            }
            placement="right"
          >
            <span>
              <Button
                disabled={formik.values.isBillForm}
                htmlFor="billImg"
                color="primary"
                variant="contained"
                onClick={clickUploadBill}
              >
                {formik.values.billImg ? 'Changed the bill image' : 'Upload the bill image'}
              </Button>
              <input
                name="billImg"
                id="billImg"
                ref={uploadBillImgRef}
                onChange={(e) => setImgValue(e)}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
              />
            </span>
          </Tooltip>
          <br /> <br />
          <BillImgForm handleBillImgTotalChange={handleBillImgTotalChange} formik={formik} />
          <br /> <br />
          <Tooltip
            title={
              formik.values.billImg
                ? 'Only the bill image or the bill form'
                : 'Open a form table to enter bill details'
            }
            placement="right"
          >
            <span>
              <Button
                disabled={formik.values.billImg != null}
                color="primary"
                variant="contained"
                onClick={toggleBillForm}
              >
                {formik.values.isBillForm ? 'Remove the bill table' : 'Enter the bill manually'}
              </Button>
            </span>
          </Tooltip>
          <Button
            sx={{ marginLeft: '50px' }}
            htmlFor="update"
            color="primary"
            variant="contained"
            onClick={handleUpdateForm}
          >
            Update
          </Button>
          <BillForm
            isBillForm={formik.values.isBillForm}
            formik={formik}
            handleDescChange={handleDescChange}
            handlePriceChange={handlePriceChange}
            editBillForm={editBillForm}
          />
          <br /> <br />
          <SplitForm
            users={users.data}
            isBillForm={formik.values.isBillForm}
            formik={formik}
            handleFixedCheck={handleFixedCheck}
            handleOwnedChange={handleOwnedChange}
          />
        </Form>
      </Formik>
    </>
  )
}

export default ExpenseForm
