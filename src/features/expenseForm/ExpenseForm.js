import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Formik, Form, useFormik, FieldArray } from 'formik'
import * as yup from 'yup'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import {
  Avatar,
  Button,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip
} from '@mui/material'
import Preview from './Preview'
import ExpenseTab from '../expenseTab/ExpenseTab'
import BillImgForm from './BillImgForm'
import BillForm from './BillForm'
import SplitForm from './SplitForm'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { useDispatch } from 'react-redux'
import { getExpenseFormById } from '../../redux/slices/expenseFormSlice'
import { useSelector } from 'react-redux'
import { getUsersByIds } from '../../redux/slices/usersSlice'

const ExpenseForm = () => {
  const uploadBillImgRef = useRef()
  const [isBillForm, setIsBillForm] = useState(false)
  const { expenseFormId } = useParams()
  const expenseForm = useSelector((state) => state.expenseForm)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getExpenseFormById(expenseFormId))
  }, [dispatch])
  useEffect(() => {
    if (expenseForm.status === 'succeeded') {
      const memberIds = expenseForm.data.members.map((elem) => elem.id)
      dispatch(getUsersByIds(memberIds))
    }
  }, [expenseForm.status])
  //setting up form
  const validationSchema = yup.object().shape({
    billDesc: yup.array().of(yup.string()),
    billPrice: yup.array().of(yup.number()),
    total: yup.number(),
    billImg: yup.object()
  })
  const initialValues = {
    name: 'Pizza',
    billDesc: [''],
    billPrice: [0],
    total: 0,
    billImg: null,
    billImgTotal: 0,
    members: [
      {
        uid: '123',
        owned: 0,
        note: 'Haha 123',
        fixed: false
      },
      {
        uid: '1231',
        owned: 0,
        note: 'Haha 123',
        fixed: false
      },
      {
        uid: '1223',
        owned: 0,
        note: 'Haha 123',
        fixed: false
      }
    ]
  }
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2))
    }
  })
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
    if (fixedCnt == formik.values.members.length - 1) {
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
    if (isBillForm) {
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
    formik.setValues({ ...formik.values, total: newTotal, members: newMembers })
    setIsBillForm(!isBillForm)
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
      console.log('returned')
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
    //update total, billPrice, billDesc
    const currLength = formik.values.billDesc.length

    const billDescArr = [...formik.values.billDesc]
    const billPriceArr = [...formik.values.billPrice]
    if (operation === 'add') {
      billDescArr[currLength] = ''
      billPriceArr[currLength] = 0
    } else if (operation === 'remove' && currLength > 1) {
      console.log(billPriceArr)
      billDescArr.splice(index, 1)
      console.log(billPriceArr.splice(index, 1))
      console.log(billPriceArr)
    }
    const newTotal = getTotal(billPriceArr)
    const fixedTotal = getFixedTotal(formik.values.members)
    if (newTotal < fixedTotal) {
      return
    }
    formik.setValues({
      ...formik.values,
      billPrice: billPriceArr,
      billDesc: billDescArr,
      total: newTotal
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

  useEffect(() => {
    if (formik.values.billImg) {
      formik.setValues({ ...formik.values, billImgTotal: formik.values.total })
    }
  }, [formik.values.total])
  return (
    <>
      <Formik
        className="ExpenseForm"
        onSubmit={formik.handleSubmit}
        style={{ textAlign: 'left', margin: '10px 20px' }}
      >
        <Form>
          <Button sx={{ float: 'right' }} variant="outlined" color="error">
            Delete
          </Button>
          <Preview file={formik.values.billImg} removeBillImg={removeBillImg} />
          <Tooltip
            title={isBillForm ? 'Only the bill image or the bill form' : 'Upload a receipt image'}
            placement="right"
          >
            <span>
              <Button
                disabled={isBillForm}
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
                {isBillForm ? 'Remove the bill table' : 'Enter the bill manually'}
              </Button>
            </span>
          </Tooltip>
          <BillForm
            isBillForm={isBillForm}
            formik={formik}
            handleDescChange={handleDescChange}
            handlePriceChange={handlePriceChange}
            editBillForm={editBillForm}
          />
          <br /> <br />
          <SplitForm
            isBillForm={isBillForm}
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
