from app.models.audit_log import AuditLog

def log_action(db, user_id, action, entity_type, entity_id):
    entry = AuditLog(user_id=user_id, action=action, entity_type=entity_type, entity_id=entity_id)
    db.add(entry)
    db.commit()

ELEMENTS = ["nd", "pr", "dy", "tb", "ce", "la", "sm", "fe", "b"]

def element_to_range(value):
    if value is None:
        return None
    if value < 1:
        return "< 1%"
    elif value < 2:
        return "1-2%"
    elif value < 5:
        return "2-5%"
    elif value < 10:
        return "5-10%"
    else:
        return "> 10%"

def composition_presence(record):
    return {
        "disclosure_level": "presence",
        **{f"contains_{e}": (getattr(record, e) or 0) > 0 for e in ELEMENTS}
    }

def composition_ranges(record):
    return {
        "disclosure_level": "ranges",
        **{e: element_to_range(getattr(record, e)) for e in ELEMENTS}
    }

def composition_exact(record):
    return {
        "disclosure_level": "exact",
        **{e: getattr(record, e) for e in ELEMENTS}
    }

def composition_full(record):
    return {
        "disclosure_level": "full",
        **{e: getattr(record, e) for e in ELEMENTS},
        "magnet_grade": record.magnet_grade,
        "coercivity": record.coercivity,
        "remanence": record.remanence,
        "temperature_class": record.temperature_class
    }
